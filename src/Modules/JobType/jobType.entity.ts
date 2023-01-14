import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../User/user.entity';

@Entity({ name: 'jobtype' })
export class JobType {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
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
  updated_by: User;

  @ManyToOne(() => User, (user) => user.id)
  deleted_by: User;
}
