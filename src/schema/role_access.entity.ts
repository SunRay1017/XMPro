import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleAccess {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ default: '' })
  role_id: string;

  @Column({ default: '' })
  access_id: string;

}
