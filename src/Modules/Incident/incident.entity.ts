import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Datel } from '../Datel/datel.entity';
import { JobType } from '../JobType/jobType.entity';
import { User } from '../User/user.entity';

import { IncidentDetail } from './incidentDetail.entity';

export enum OnTier {
  tier_1 = 'Tier 1',
  tier_2 = 'Mitra',
  tier_3 = 'Tier 3',
  wh = 'Warehouse',
  commerce = 'Commerce',
}

export enum StatusTier1 {
  open = 'Open',
  closed = 'Closed',
  mitra_done = 'Mitra Done',
  return_to_mitra = 'Return to Mitra',
  mitra_revision = 'Mitra Done (Revision)',
}

export enum StatusTier2 {
  open = 'Open',
  mitra_done = 'Mitra Done',
  closed_pekerjaan = 'Closed Pekerjaan',
  return_by_tier_1 = 'Return by Tier 1',
}

export enum statusTier3 {
  open = 'Open',
  closed_pekerjaan = 'Closed Pekerjaan',
  cek_list_by_wh = 'Cek List By WH',
  wh_done = 'WH Done',
}

export enum statusWh {
  open = 'Open',
  return = 'Return',
  closed = 'Closed',
}

@Entity({ name: 'incident' })
export class Incident {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  incident_code: string;

  @Column()
  incident: string;

  @Column({ type: 'text' })
  summary: string;

  @ManyToOne(() => JobType, (job_type) => job_type.id)
  job_type_id: JobType;

  @ManyToOne(() => Datel, (datel) => datel.id)
  datel_id: Datel;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'enum', enum: OnTier })
  on_tier: OnTier;

  @Column({ type: 'enum', enum: StatusTier1 })
  status_tier_1: StatusTier1;

  @Column({ type: 'enum', enum: StatusTier2, nullable: true })
  status_tier_2?: StatusTier2;

  @Column({ type: 'enum', enum: statusTier3, nullable: true })
  status_tier_3?: statusTier3;

  @Column({ type: 'enum', enum: statusWh, nullable: true })
  status_wh?: statusWh;

  @ManyToOne(() => User, (user) => user.id)
  assigned_mitra: User;

  @OneToMany(
    () => IncidentDetail,
    (incident_detail) => incident_detail.incident_id,
  )
  incident_details: IncidentDetail;

  @Column({ type: 'date' })
  open_at: Date;

  @Column({ nullable: true, type: 'date' })
  close_at: Date;

  @Column({ nullable: true })
  commerce_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @Column({ nullable: true })
  delete_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  created_by: User;

  @ManyToOne(() => User, (user) => user.id)
  updated_by?: User;

  @ManyToOne(() => User, (user) => user.id)
  deleted_by?: User;
}
