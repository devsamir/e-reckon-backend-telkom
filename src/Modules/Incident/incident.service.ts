import { Injectable, InternalServerErrorException } from '@nestjs/common';

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
    return this.prisma.incidents.update({
      where: { id },
      data: { ...body, updated_by: user.id, update_at: new Date() },
    });
  }

  async delete(id: number) {
    return this.prisma.incidents.delete({ where: { id } });
  }
}
