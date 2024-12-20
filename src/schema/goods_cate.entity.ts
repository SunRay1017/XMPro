import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoodsCate {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: "" })
  cate_img: string;

  @Column({ default: "" })
  template: string;

  @Column({ default: "" })
  pid: string;
  
  @Column({ default: "" })
  link: string;

  @Column({ default: "" })
  sub_title: string;

  @Column({ default: "" })
  keywords: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 1 })
  sort: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  add_time: number;

}
