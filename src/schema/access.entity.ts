import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Access {
  @PrimaryGeneratedColumn("uuid")
  access_id: string;

  @Column({ default: '' })
  module_name: string;

  @Column({ default: '' })
  action_name: string;

  @Column()
  type: number;

  @Column({ default: '' })
  url: string;

  @Column({ default: '' })
  module_id: string;

  @Column({ default: 100 })
  sort: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: 1 })
  status: number;

  @Column({type: 'double',default: new Date().valueOf()})
  add_time: number;

}
