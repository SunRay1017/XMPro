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
  async findAccessByUrl(path) {
    var data = await this.accessRepository.find({where:{url:path}})
    return data
  }
  async findRecord(id) {
    var data = await this.accessRepository.findOne({where:{access_id:id}})
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
  async update(body) {
    try {

      await this.accessRepository.update({access_id:body.access_id},body);
      return { code: "success", msg: '修改权限成功', data: body };
    } catch (error) {
      return { code: "fail", msg: '修改权限失败', data: {} };
    }
  }
  async delete(id:string) {
    try {
       await this.accessRepository.delete({access_id:id});
       return {code:"success", msg:'删除权限成功', data: {}};
    } catch (error) {
      return {code:"fail", msg: '删除权限失败', data: {} };
    }
  }
}
