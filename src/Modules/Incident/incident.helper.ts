import { format } from 'date-fns';
import { Like, Repository } from 'typeorm';

import { PrismaService } from '../../Prisma/prisma.service';

import { Incident } from './incident.entity';

export const generateIncidentCode = async (incident: Repository<Incident>) => {
  const prefix = `I-${format(new Date(), 'yyyyMMdd')}`;
  const lastestIncident = await incident.findOne({
    where: { incident_code: Like(`${prefix}%`) },
    order: { id: 'DESC' },
  });
  if (lastestIncident) {
    const val = `0000${
      Number(lastestIncident.incident_code.replace(prefix, '')) + 1
    }`;
    return prefix + val.substring(val.length - 4);
  } else {
    return `${prefix}0001`;
  }
};
