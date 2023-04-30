import { Injectable } from '@nestjs/common';

import { DatelService } from '../Datel/datel.service';
import { Incident } from '../Incident/incident.entity';
import { IncidentService } from '../Incident/incident.service';
import { User } from '../User/user.entity';

import { GetDashboardData } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    private incidentService: IncidentService,
    private datelService: DatelService,
  ) {}
  async getDashboardData(domain: GetDashboardData, user: User) {
    let query = '';
    if (domain.datel_id) query += ` and i.datelIdId=${domain.datel_id}`;
    if (domain.start_date && domain.end_date)
      query += ` and i.open_at >= '${domain.start_date}' and i.open_at <= '${domain.end_date}'`;

    const incidents: (Incident & { name: string; assignedMitraId: number })[] =
      await this.incidentService.incidentRepository.query(
        `select i.*,d.name from incident as i,datel as d where i.datelIdId = d.id ${query}`,
      );

    const datels = await this.datelService.getAll({
      domain: [...(domain.datel_id ? [['id', '=', domain.datel_id]] : [])],
    });

    return datels.data.map((datel) => {
      // Tier 1
      const tier1Open =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Tier 1' &&
            incident.status_tier_1 === 'Open' &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;
      const tier1MitraDone =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Tier 1' &&
            (incident.status_tier_1 === 'Mitra Done (Revision)' ||
              incident.status_tier_1 === 'Mitra Done') &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;
      const tier1Closed =
        incidents.filter(
          (incident) =>
            incident.status_tier_1 === 'Closed' &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;
      // Tier 2
      const tier2Open =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Mitra' &&
            incident.status_tier_2 === 'Open' &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;
      const tier2Return =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Mitra' &&
            incident.status_tier_2 === 'Return by Tier 1' &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;

      const commerceOpen =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Commerce' &&
            !incident.commerce_code &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;

      const commerceClosed =
        incidents.filter(
          (incident) =>
            incident.on_tier === 'Commerce' &&
            !!incident.commerce_code &&
            incident.name === datel.name &&
            (user.role === 'mitra'
              ? user.id === incident.assignedMitraId
              : true),
        ).length || 0;

      return {
        name: datel.name,
        datel_id: datel.id,

        tier_1: {
          open: tier1Open,
          mitra_done: tier1MitraDone,
          closed: tier1Closed,
        },
        tier_2: {
          open: tier2Open,
          return: tier2Return,
        },
        commerce: {
          not_filled: commerceOpen,
          filled: commerceClosed,
        },
      };
    });
  }
}
