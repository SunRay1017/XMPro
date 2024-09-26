import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '', select: false })
  password: string;

  @Column({ default: '' })
  mobile: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  role_id: string;

  @Column({ default: 1 })
  status: number;

  @Column({type: 'double',default: new Date().valueOf()})
  add_time: number;

  @Column({default: 0 })
  is_super: number;
}
