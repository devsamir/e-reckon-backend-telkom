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

    return this.prisma.incidents.create({
      data: {
        incident: body.incident,
        job_type: body.job_type,
        summary: body.summary,
        incident_code: incidentCode,
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
      const mitra = await this.prisma.mitra.findFirst({
        where: { id: body.assigned_mitra, active: true },
      });
      if (!mitra) throw new BadRequestException('Mitra tidak ditemukan');
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
          job_type: body.job_type,
          summary: body.summary,
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
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
  async submitWhSecondTier(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');
    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'wh',
        status_wh: 'open',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
  async confirmWhSecondTier(body: ConfirmFirstTier, user: User) {
    const incident = await this.prisma.incidents.findUnique({
      where: { id: body.id },
    });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');
    const incidentDetails = await this.prisma.incidentDetails.findMany({
      where: { incident_id: body.id },
    });

    if (incidentDetails.some((detail) => detail.approve_wh !== 'approved'))
      throw new BadRequestException(
        'Tidak bisa confirm WH ke mitra jika ada material yang tidak di approve',
      );

    return this.prisma.incidents.update({
      where: { id: body.id },
      data: {
        on_tier: 'tier_2',
        status_tier_2: 'wh_done',
        updated_by: user.id,
        update_at: new Date(),
      },
    });
  }
}
