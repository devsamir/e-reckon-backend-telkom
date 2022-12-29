import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import {
  ConfirmFirstTier,
  CreateIncidentDto,
  UpdateIncidentDto,
} from './incident.dto';
import { generateIncidentCode } from './incident.helper';

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaService) {}

  async getAll(body: GetAllQuery) {
    const generatedQuery = generateQuery(body);
    const [length, data] = await Promise.all([
      this.prisma.incidents.count({
        where: { ...generatedQuery.where },
      }),
      this.prisma.incidents.findMany({
        ...generatedQuery,
        where: { ...generatedQuery.where },
      }),
    ]).catch(() => {
      throw new InternalServerErrorException('Query pencarian salah');
    });

    return { length, data };
  }

  async get(id: number) {
    return this.prisma.incidents.findFirst({
      where: { id },
      include: {
        assignedMitra: true,
        IncidentDetails: {
          include: {
            item: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });
  }

  async create(body: CreateIncidentDto, user: User) {
    // Generate Incident Code
    const incidentCode = await generateIncidentCode(this.prisma);

    // Check if datel is exist
    const datelPromise = this.prisma.datel.findUnique({
      where: { id: body.datel_id },
    });

    // Check if incident is exist
    const jobTypePromise = this.prisma.jobType.findUnique({
      where: { id: body.job_type_id },
    });
    // make it run parallel with promise.all
    const [datel, jobType] = await Promise.all([datelPromise, jobTypePromise]);

    if (!datel) throw new BadRequestException('Datel tidak ditemukan');
    if (!jobType)
      throw new BadRequestException('Jenis pekerjaan tidak ditemukan');

    return this.prisma.incidents.create({
      data: {
        incident: body.incident,
        job_type_id: body.job_type_id,
        summary: body.summary,
        incident_code: incidentCode,
        datel_id: body.datel_id,
        open_at: body.open_at,
        created_by: user.id,
      },
    });
  }

  async update(id: number, body: UpdateIncidentDto, user: User) {
    // Check if incident is exist
    const incident = await this.prisma.incidents.findUnique({ where: { id } });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    // Check if mitra is valid
    if (body.assigned_mitra) {
      const mitra = await this.prisma.user.findFirst({
        where: { id: body.assigned_mitra, role: 'mitra', active: true },
      });
      if (!mitra) throw new BadRequestException('Mitra tidak ditemukan');
    }

    // Check if datel is valid
    if (body.datel_id) {
      const datel = await this.prisma.datel.findUnique({
        where: { id: body.datel_id },
      });
      if (!datel) throw new BadRequestException('Datel tidak ditemukan');
    }

    if (body?.incident_details?.length) {
      const itemIds = [
        ...new Set(body.incident_details.map((item) => item.item_id)),
      ].filter((v) => !!v);
      const countItem = await this.prisma.items.count({
        where: { id: { in: itemIds }, active: true },
      });
      if (itemIds.length !== countItem)
        throw new BadRequestException('Material tidak valid');
    }
    return this.prisma.$transaction(async () => {
      const incident = await this.prisma.incidents.update({
        where: { id },
        data: {
          incident: body.incident,
          job_type_id: body.job_type_id,
          summary: body.summary,
          datel_id: body.datel_id,
          assigned_mitra: body?.assigned_mitra,
          updated_by: user.id,
          update_at: new Date(),
        },
      });
      if (!body?.incident_details?.length) return incident;

      const newIncidentDetails = await this.prisma.incidentDetails.createMany({
        data: body.incident_details
          .filter((incident) => incident.orm_code === 'create')
          .map((incident) => ({
            incident_id: id,
            item_id: incident.item_id,
            qty: incident.qty,
            job_detail: incident.job_detail,
            approve_wh: incident.approve_wh,
            actual_qty: incident.actual_qty,
          })) as any,
      });

      const incidentDetails = await Promise.all(
        body.incident_details
          .filter((incident) => incident.orm_code !== 'create')
          .map(async (incident) => {
            if (incident.orm_code === 'update') {
              const updatedIncident = await this.prisma.incidentDetails.update({
                where: { id: incident.id },
                data: {
                  qty: incident.qty,
                  job_detail: incident.job_detail,
                  approve_wh: incident.approve_wh,
                  actual_qty: incident.actual_qty,
                },
                select: {
                  id: true,
                },
              });
              return updatedIncident.id;
            } else if (incident.orm_code === 'delete') {
              const deletedIncident = await this.prisma.incidentDetails.delete({
                where: { id: incident.id },
                select: { id: true },
              });
              return deletedIncident.id;
            }
          }),
      );
      return {
        incident,
        count: incidentDetails.length + newIncidentDetails.count,
      };
    });
  }

  async delete(ids: number[]) {
    return this.prisma.$transaction(async () => {
      const deletedIncidentDetails =
        await this.prisma.incidentDetails.deleteMany({
          where: { incident_id: { in: ids } },
        });
      const deletedIncident = await this.prisma.incidents.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return { deletedIncidentDetails, deletedIncident };
    });
  }
  async confirmFirstTier(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');
    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'tier_2',
        status_tier_2: 'open',
        status_tier_1: 'closed',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
  async finishIncidentMitra(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');
    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'tier_1',
        status_tier_1: 'mitra_done',
        status_tier_2: 'mitra_done',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
  async returnToMitra(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'tier_2',
        status_tier_2: 'return_by_tier_1',
        status_tier_1: 'return_to_mitra',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }

  async closeIncident(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'commerce',
        status_tier_2: 'closed_pekerjaan',
        status_tier_1: 'closed',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
}
