import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goods {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  sub_title: string;
  @Column({ default: '' })
  goods_sn: string;
  @Column({ default: '' })
  cate_id: string;
  @Column({ default: 100 })
  click_count: number
  @Column({ default: 1000 })
  goods_number: number
  @Column({ default: 0 })
  shop_price: number
  @Column({ default: 0 })
  market_price: number
  @Column({ default: '' })
  relation_goods: string;
  @Column({ default: '' })
  goods_attrs: string;
  @Column({ default: '' })
  goods_version: string;
  @Column({ default: '' })
  goods_img: string;
  @Column({ default: '' })
  goods_gift: string;
  @Column({ default: '' })
  goods_fitting: string;
  @Column({ default: '' })
  goods_color: string;
  @Column({ default: '' })
  goods_keywords: string;
  @Column({ default: '' })
  goods_desc: string;
  @Column({ default: '' })
  goods_content: string;
  @Column({ default: 100 })
  sort: number;
  @Column({ default: 0 })
  is_delete: number
  @Column({ default: 0 })
  is_hot: number
  @Column({ default: 0 })
  is_best: number
  @Column({ default: 0 })
  is_new: number
  @Column({ default: '' })
  goods_type_id: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'double', default: new Date().valueOf() })
  add_time: number;

}
