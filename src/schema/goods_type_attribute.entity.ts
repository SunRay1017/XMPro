import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoodsTypeAttribute {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  cate_id: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' }) //类型   1 input    2  textarea     3、select
  attr_type: string;

  @Column({ default: '' })//默认值： input  textarea默认值是空     select框有默认值  多个默认值以回车隔开
  attr_value: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  add_time: number;

}
