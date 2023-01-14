import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Unit } from '../Unit/unit.entity';
import { User } from '../User/user.entity';

@Entity({ name: 'item' })
export class Item {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  item_code: string;
  @Column()
  material_designator: string;

  @Column()
  service_designator: string;

  @ManyToOne(() => Unit, (unit) => unit.id)
  unit_id: Unit;

  @Column({ nullable: true })
  material_price_telkom?: number;

  @Column({ nullable: true })
  service_price_telkom?: number;

  @Column({ nullable: true })
  material_price_mitra?: number;

  @Column({ nullable: true })
  service_price_mitra?: number;

  @Column({ default: true })
  active: boolean;

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
