import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../../schema/admin.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

  ) { }
  async findOne(admin) {
    var data = await this.adminRepository.findOne({ where: admin })
    return data
  }
  async find() {
    try {
      // const result =await this.adminRepository.createQueryBuilder("admin")
      //   .leftJoinAndSelect('admin.role_id', 'role')
      //   .getMany();
      // console.log("%c Line:20 🍕 result", "color:#e41a6a", result);
      return await this.adminRepository.find()
    } catch (error) {
      return [];
    }

  }
  async findOneById(userId: string) {
    try {
      return await this.adminRepository.findOne({ where: { userId } })
    } catch (error) {
      return {};
    }

  }
  async add(admin: Admin) {
    console.log("%c Line:38 🍪 admin", "color:#2eafb0", admin);
    try {

      await this.adminRepository.save(admin);
      return { code: "success", msg: '新增用户成功', data: admin };
    } catch (error) {
      return { code: "fail", msg: '新增用户失败', data: {} };
    }
  }

  async update(admin) {
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.adminRepository.findOne({ where: { userId: admin.userId } })
      console.log("%c Line:52 🍅 oldData", "color:#7f2b82", oldData);

      await this.adminRepository.update(oldData, admin);
      return { code: "success", msg: '更新用户成功', data: admin };
    } catch (error) {
      return { code: "fail", msg: '更新用户失败', data: {} };
    }
  }

  async delete(userId: string) {
    try {
      await this.adminRepository.delete({ userId });
      return { code: "success", msg: '删除用户成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除用户失败', data: {} };
    }
  }
}
