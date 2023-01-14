import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../User/user.entity';

@Entity({ name: 'witel' })
export class Witel {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;

  @OneToMany(() => Datel, (datel) => datel.witel_id)
  datel: Datel[];
}

@Entity({ name: 'datel' })
export class Datel {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Witel, (witel) => witel.id)
  witel_id: Witel;
}
