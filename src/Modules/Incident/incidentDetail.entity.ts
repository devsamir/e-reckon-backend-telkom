import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Item } from '../Item/item.entity';
import { User } from '../User/user.entity';

import { Incident } from './incident.entity';

export enum ApproveWh {
  not_yet = 'Not Yet',
  approved = 'Approved',
  decline = 'Decline',
}

@Entity({ name: 'incident_detail' })
export class IncidentDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Incident, (incident) => incident.id)
  incident_id: Incident;

  @ManyToOne(() => Item, (item) => item.id)
  item_id: Item;

  @Column({ nullable: true, type: 'text' })
  job_detail?: string;

  @Column()
  qty: number;

  @Column({ nullable: true })
  actual_qty?: number;

  @Column({ type: 'enum', enum: ApproveWh, nullable: true })
  approve_wh?: ApproveWh;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  created_by: User;

  @ManyToOne(() => User, (user) => user.id)
  updated_by?: User;
}
