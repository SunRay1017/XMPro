import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoodsColor {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  color_name: string;

  @Column({ default: "" })
  color_value: string;

  @Column({ default: 1 })
  status: number;

}
