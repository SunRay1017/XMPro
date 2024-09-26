import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  role_id: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;


  @Column({ default: 1 })
  status: number;

  @Column({type: 'double',default: new Date().valueOf()})
  add_time: number;

}
