import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@prisma/client';
import { DataSource, In, Not, Repository } from 'typeorm';

import { generateQuery } from '../../Common/helpers';
import { DatelService } from '../Datel/datel.service';
import { ItemService } from '../Item/item.service';
import { JobTypeService } from '../JobType/jobType.service';
import { Role } from '../User/user.entity';
import { UserService } from '../User/user.service';

import {
  ConfirmFirstTier,
  CreateIncidentDto,
  UpdateIncidentDto,
} from './incident.dto';
import { Incident, OnTier, StatusTier1, StatusTier2 } from './incident.entity';
import { generateIncidentCode } from './incident.helper';
import { IncidentDetail } from './incidentDetail.entity';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident) private incident: Repository<Incident>,
    private datelService: DatelService,
    private jobTypeService: JobTypeService,
    private userService: UserService,
    private itemService: ItemService,
    private dataSource: DataSource,
  ) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);

    const [length, data] = await Promise.all([
      this.incident.count({
        where: { ...generatedQuery.where },
      }),
      this.incident.find({
        ...generatedQuery,
        where: { ...generatedQuery.where },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async getWarehouseOrder(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);

    const [length, data] = await Promise.all([
      this.incident.count({
        where: [
          { on_tier: OnTier.tier_2, ...generatedQuery.where },
          {
            on_tier: OnTier.tier_1,
            status_tier_1: Not(StatusTier1.open),
            ...generatedQuery.where,
          },
        ],
      }),
      this.incident.find({
        ...generatedQuery,
        where: [
          { on_tier: OnTier.tier_2, ...generatedQuery.where },
          {
            on_tier: OnTier.tier_1,
            status_tier_1: Not(StatusTier1.open),
            ...generatedQuery.where,
          },
        ],
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.incident.find({
      where: { id },
      relations: {
        assigned_mitra: true,
        datel_id: true,
        job_type_id: true,
        incident_details: {
          item_id: {
            unit_id: true,
          },
        },
      },
    });
  }

  async create(body: CreateIncidentDto, user: User) {
    // Generate Incident Code
    const incidentCode = await generateIncidentCode(this.incident);

    // Check if datel is exist
    const datelPromise = this.datelService.get(body.datel_id);

    // Check if incident is exist
    const jobTypePromise = this.jobTypeService.get(body.job_type_id);

    // make it run parallel with promise.all
    const [datel, jobType] = await Promise.all([datelPromise, jobTypePromise]);

    if (!datel) throw new BadRequestException('Datel tidak ditemukan');
    if (!jobType)
      throw new BadRequestException('Jenis pekerjaan tidak ditemukan');

    const newIncident = this.incident.create({
      incident: body.incident,
      job_type_id: { id: body.job_type_id },
      summary: body.summary,
      incident_code: incidentCode,
      datel_id: { id: body.datel_id },
      open_at: body.open_at,
      created_by: { id: user.id },
    });

    return this.incident.save(newIncident);
  }

  async update(id: number, body: UpdateIncidentDto, user: User) {
    // Check if incident is exist
    const incident = await this.incident.findOne({ where: { id } });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    // Check if mitra is valid
    if (body.assigned_mitra) {
      const mitra = await this.userService.get(body.assigned_mitra);
      if (!mitra || mitra.role !== Role.MITRA)
        throw new BadRequestException('Mitra tidak ditemukan');
    }

    // Check if datel is valid
    if (body.datel_id) {
      const datel = await this.datelService.get(body.datel_id);
      if (!datel) throw new BadRequestException('Datel tidak ditemukan');
    }

    if (body?.incident_details?.length) {
      const itemIds = [
        ...new Set(body.incident_details.map((item) => item.item_id)),
      ].filter((v) => !!v);
      const items = await this.itemService.getAll({
        domain: [
          ['active', '=', true],
          ['id', 'in', itemIds],
        ],
      });
      if (itemIds.length !== items.length)
        throw new BadRequestException('Material tidak valid');
    }
    return this.dataSource.manager.transaction(async (manager) => {
      const incident = await manager.update(Incident, id, {
        incident: body.incident,
        job_type_id: { id: body.job_type_id },
        summary: body.summary,
        datel_id: { id: body.datel_id },
        assigned_mitra: { id: body?.assigned_mitra },
        updated_by: { id: user.id },
        update_at: new Date(),
      });

      if (!body?.incident_details?.length) return incident;
      const newIncidentDetails = body.incident_details
        .filter((incident) => incident.orm_code === 'create')
        .map((incident) =>
          manager.create(IncidentDetail, {
            incident_id: { id },
            item_id: { id: incident.item_id },
            qty: incident.qty,
            job_detail: incident.job_detail,
            approve_wh: incident.approve_wh,
            actual_qty: incident.actual_qty,
          }),
        );
      await manager.save(IncidentDetail, newIncidentDetails);

      body.incident_details
        .filter((incident) => incident.orm_code !== 'create')
        .map(async (incident) => {
          if (incident.orm_code === 'update') {
            const updatedIncident = await manager.update(
              IncidentDetail,
              incident.id,
              {
                qty: incident.qty,
                job_detail: incident.job_detail,
                approve_wh: incident.approve_wh,
                actual_qty: incident.actual_qty,
              },
            );
            return updatedIncident.raw;
          } else if (incident.orm_code === 'delete') {
            const deletedIncident = await manager.delete(
              IncidentDetail,
              incident.id,
            );
            return deletedIncident.raw;
          }
        });

      return true;
    });
  }

  async delete(ids: number[]) {
    return this.dataSource.manager.transaction(async (manager) => {
      await manager.delete(IncidentDetail, { incident_id: In(ids) });
      await manager.delete(Incident, { id: In(ids) });

      return true;
    });
  }
  async confirmFirstTier(body: ConfirmFirstTier, user: User) {
    const incident = await this.incident.findOne({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');
    return this.incident.update(body.id, {
      on_tier: OnTier.tier_2,
      status_tier_2: StatusTier2.open,
      status_tier_1: StatusTier1.closed,
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }
  async finishIncidentMitra(body: ConfirmFirstTier, user: User) {
    const incident = await this.incident.findOne({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    return this.incident.update(body.id, {
      on_tier: OnTier.tier_1,
      status_tier_1: StatusTier1.mitra_done,
      status_tier_2: StatusTier2.mitra_done,
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }
  async returnToMitra(body: ConfirmFirstTier, user: User) {
    const incident = await this.incident.findOne({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    return this.incident.update(body.id, {
      on_tier: OnTier.tier_2,
      status_tier_2: StatusTier2.return_by_tier_1,
      status_tier_1: StatusTier1.return_to_mitra,
      updated_by: { id: user.id },
      update_at: new Date(),
    });
  }

  async closeIncident(body: ConfirmFirstTier, user: User) {
    const incident = await this.incident.findOne({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    return this.incident.update(body.id, {
      on_tier: OnTier.commerce,
      status_tier_2: StatusTier2.closed_pekerjaan,
      status_tier_1: StatusTier1.closed,
      updated_by: { id: user.id },
      update_at: new Date(),
      close_at: new Date(),
    });
  }
}
