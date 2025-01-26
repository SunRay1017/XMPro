import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoodsAttr {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  goods_id: string;

  @Column({ default: '' })
  goods_cate_id: string;

  @Column({ default: "" })
  attribute_cate_id: string;
  
  @Column({ default: "" })
  attribute_id: string;

  @Column({ default: "" })
  attribute_type: string;

  @Column({ default: "" })
  attribute_title: string;

  @Column({ default: "" })
  attribute_value: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: "" })
  add_time: string;


}
