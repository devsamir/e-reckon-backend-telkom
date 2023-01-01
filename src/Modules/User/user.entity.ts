import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  MITRA = 'mitra',
  COMMERCE = 'commerce',
  WH = 'wh',
  TELKOM = 'telkom',
  TL = 'tl',
  FIRST_TIER = 'first_tier',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  fullname?: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
