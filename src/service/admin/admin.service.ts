import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../../schema/admin.entity';
import { Config } from 'src/config/config';
import { RoleService } from '../role/role.service';
import { AccessService } from '../access/access.service';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private roleService: RoleService, 
    private accessService:AccessService
   

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

  async checkAuth(req) {

    /*
      1、获取当前用户的角色    （如果超级管理员跳过权限判断 is_super=1）
      2、根据角色获取当前角色的权限列表                       
      3、获取当前访问的url 对应的权限id
      4、判断当前访问的url对应的权限id 是否在权限列表中的id中
  */

    //  1、获取当前用户的角色

    var pathname: string = req.baseUrl;

    pathname = pathname.replace(`/${Config.adminPath}/`, '');
    console.log("%c Line:89 🥓 pathname", "color:#6ec1c2", pathname);

    var userinfo = req.session.userinfo;
    var role_id = userinfo.role_id;
    if (userinfo.is_super == 1 || pathname == 'login/loginOut' ||pathname == "main/welcome") {
        return true;
    }

    // 2、根据角色获取当前角色的权限列表

    var accessResult = await this.roleService.queryAccess(role_id);

    var roleAccessArray = [];
    accessResult.forEach(value => {
        roleAccessArray.push(value.access_id.toString());
    });

    console.log(roleAccessArray);


    //   3、获取当前访问的url 对应的权限id


    var accessList = await this.accessService.findAccessByUrl(pathname);

    if (accessList.length > 0) {

        // 4、判断当前访问的url对应的权限id 是否在权限列表中的id中

        if (roleAccessArray.indexOf(accessList[0].access_id.toString()) != -1) {

            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }




}
}
