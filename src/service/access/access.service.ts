import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Access } from '../../schema/access.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,

  ) { }
  async find() {
    var data = await this.accessRepository.find()
    return data
  }
  async findModules() {
    var data = await this.accessRepository.find({where:{module_id:'0'}})
    return data
  }

  async add(access) {
    try {

      await this.accessRepository.save(access);
      return { code: "success", msg: '新增权限成功', data: access };
    } catch (error) {
      return { code: "fail", msg: '新增权限失败', data: {} };
    }
  }
}
