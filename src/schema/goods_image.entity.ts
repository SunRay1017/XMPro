import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoodsImg {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  goods_id: string;

  @Column({ default: '' })
  img_url: string;

  @Column({ default: "" })
  color_id: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 1 })
  sort: number;

  @Column({ default: "" })
  add_time: string;


}
