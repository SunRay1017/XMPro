import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Nav {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  link: string;

  @Column({ default: 2 })
  position: number;

  @Column({ default: 1 })
  is_opennew: number;

  @Column({ default: "" })
  relation: string;


  @Column({ default: 100 })
  status: number;
  
  @Column({ default: 100 })
  sort: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  add_time: number;

}

