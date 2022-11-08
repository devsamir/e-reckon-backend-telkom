import { format } from 'date-fns';

import { PrismaService } from '../../Prisma/prisma.service';

export const generateIncidentCode = async (prisma: PrismaService) => {
  const prefix = `I-${format(new Date(), 'yyyyMMdd')}`;
  const lastestIncident = await prisma.incidents.findFirst({
    where: { incident_code: { contains: prefix } },
    orderBy: { id: 'desc' },
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
