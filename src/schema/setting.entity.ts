import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  site_title: string;

  @Column({ default: '' })
  site_logo: string;

  @Column({ default: '' })
  site_keywords: string;

  @Column({ default: '' })
  site_description: string;

  @Column({ default: '' })
  no_picture: string;

  @Column({ default: '' })
  site_icp: string;

  @Column({ default: '' })
  site_tel: string;

  @Column({ default: '' })
  search_keywords: string;

  @Column({ default: '' })
  tongji_code: string;

}
