import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { generateQuery } from '../../Common/helpers';
import { PrismaService } from '../../Prisma/prisma.service';

import { CreateIncidentDto, UpdateIncidentDto } from './incident.dto';
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
            item: true,
          },
        },
      },
    });
  }

  async create(body: CreateIncidentDto, user: User) {
    // Generate Incident Code
    const incidentCode = await generateIncidentCode(this.prisma);

    // Get All Item ids in body an check if it exist in database
    const itemIds = [
      ...new Set(body.incident_details.map((item) => item.item_id)),
    ];
    const countItem = await this.prisma.items.count({
      where: { id: { in: itemIds }, active: true },
    });
    if (itemIds.length !== countItem)
      throw new BadRequestException('material tidak valid');

    return this.prisma.$transaction(async () => {
      const incident = await this.prisma.incidents.create({
        data: {
          incident: body.incident,
          job_type: body.job_type,
          summary: body.summary,
          incident_code: incidentCode,
          created_by: user.id,
        },
      });

      const incidentDetails = await this.prisma.incidentDetails.createMany({
        data: body.incident_details.map((detail) => ({
          incident_id: incident.id,
          item_id: detail.item_id,
          qty: detail.qty,
          job_detail: detail.job_detail,
          approve_wh: detail.approve_wh,
        })) as any,
      });

      return { incident, incidentDetails };
    });
  }

  async update(id: number, body: UpdateIncidentDto, user: User) {
    // Check if incident is exist
    const incident = await this.prisma.incidents.findUnique({ where: { id } });
    if (!incident) throw new BadRequestException('Tiket tidak ditemukan');

    if (body.incident_details.length) {
      const itemIds = [
        ...new Set(body.incident_details.map((item) => item.item_id)),
      ];
      const countItem = await this.prisma.items.count({
        where: { id: { in: itemIds }, active: true },
      });
      if (itemIds.length !== countItem)
        throw new BadRequestException('material tidak valid');
    }

    return this.prisma.$transaction(async () => {
      const incident = await this.prisma.incidents.update({
        where: { id },
        data: {
          incident: body.incident,
          job_type: body.job_type,
          summary: body.summary,
          updated_by: user.id,
          update_at: new Date(),
        },
      });

      const incidentDetails = await Promise.all(
        body.incident_details.map(async (incident) => {
          if (incident.orm_code === 'create') {
            const createdIncident = await this.prisma.incidentDetails.create({
              data: {
                incident_id: id,
                item_id: incident.item_id,
                qty: incident.qty,
                job_detail: incident.job_detail,
                approve_wh: incident.approve_wh,
              },
              select: {
                id: true,
              },
            });
            return createdIncident.id;
          } else if (incident.orm_code === 'update') {
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
      return { incident, incidentDetails };
    });
  }

  async delete(id: number) {
    return this.prisma.$transaction(async () => {
      const deletedIncidentDetails =
        await this.prisma.incidentDetails.deleteMany({
          where: { incident_id: id },
        });
      const deletedIncident = await this.prisma.incidents.delete({
        where: { id },
      });
      return { deletedIncidentDetails, deletedIncident };
    });
  }
}
