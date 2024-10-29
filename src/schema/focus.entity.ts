import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Focus {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: 0 })
  type: number;

  @Column({ default: '' })
  focus_img: string;

  @Column({ default: '' })
  link: string;

  @Column({ default: 1 })
  sort: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  add_time: number;

}
