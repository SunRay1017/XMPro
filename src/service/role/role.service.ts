import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../schema/role.entity';
import { RoleAccess } from '../../schema/role_access.entity';


@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleAccess)
    private readonly roleAccessRepository: Repository<RoleAccess>,
  ) { }

  async find() {
    try {
      return await this.roleRepository.find()
    } catch (error) {
      return [];
    }

  }
  async findOne(role_id: string) {
    try {
      return await this.roleRepository.findOne({ where: { role_id } })
    } catch (error) {
      return [];
    }

  }
  async add(role: Role) {
    try {
      // 需要比对当前填入的title和数据库里的数据有没有重复
      var isHaveTitle = await this.roleRepository.findOne({ where: { title: role.title } })
      if (isHaveTitle) {
        return { code: "fail", msg: '角色名重复', data: '' };
      }
      await this.roleRepository.save(role);
      return { code: "success", msg: '新增角色成功', data: role };
    } catch (error) {
      return { code: "fail", msg: '更新用户名失败', data: {} };
    }
  }

  async update(role: Role) {
    try {
      // 先根据role_id找出数据库的这条数据
      var oldData = await this.roleRepository.findOne({ where: { role_id: role.role_id } })

      await this.roleRepository.update(oldData, role);
      return { code: "success", msg: '更新角色成功', data: role };
    } catch (error) {
      return { code: "fail", msg: '更新角色失败', data: {} };
    }
  }

  async delete(role_id: string) {
    try {
      await this.roleRepository.delete({ role_id });
      return { code: "success", msg: '删除角色成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除角色失败', data: {} };
    }
  }
  async findAccessByRoleId(role_id: string) {
    const list= await this.roleAccessRepository.find({ where: { role_id } });
    return list
  }
  async deleteMany(role_id){
    try {
        var result=await this.roleAccessRepository.delete({role_id});          
        return result;
    } catch (error) {
        return null;
    }
}
async addAccess(json){
  try {
      var role=await this.roleAccessRepository.save(json);
    
      
  } catch (error) {
      return null;
  }
}
async   queryAccess(id){
  try {
     return await this.roleAccessRepository.find({where:{role_id:id}});
  } catch (error) {
      return null;
  }
}
}
