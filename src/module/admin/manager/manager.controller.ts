import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config'
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { AdminService } from 'src/service/admin/admin.service';

@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  constructor(private roleService: RoleService, private toolsService: ToolsService, private adminService: AdminService) { }

  @Get()
  @Render("admin/manager/index")
  async index() {
    var result = await this.adminService.find();
    const adminList = []
    var roleList = await this.roleService.find()
    for (let i = 0; i < result.length; i++) {
      adminList[i] = result[i]
      let key = result[i].role_id
      for (let j = 0; j < roleList.length; j++) {
        if (roleList[j].role_id == key) {
          adminList[i].role_name = roleList[j].title
        }
      }
    }
    return {
      adminResult: adminList
    }
  };
  @Get('add')
  @Render('admin/manager/add')
  async add() {
    var roleResult = await this.roleService.find();
    return {
      roleList: roleResult
    };
  }
  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    if (body.username == '' || body.password.length < 6) {
      this.toolsService.error(res, `/${Config.adminPath}/manager/add`, '用户名或者密码长度不合法',);
    } else {
      //从数据库查询当前用户名是否存在
      var adminResult = await this.adminService.findOne({ "username": body.username });

      if (adminResult) {
        this.toolsService.error(res, `/${Config.adminPath}/manager/add`, '此管理已经存在',);
      } else {
        body.password = this.toolsService.getMd5(body.password);
        this.adminService.add(body);
        this.toolsService.success(res, `/${Config.adminPath}/manager`);
      }

    }


  }

  @Get("edit")
  @Render("admin/manager/edit")
  async edit(@Query() query) {
    const result = await this.adminService.findOneById(query.userId)
    var roleResult = await this.roleService.find();
    return {
      adminResult: result,
      roleList: roleResult
    }
  }
  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {

    var userId:string = body.userId
    var username:string = body.username
    var password:string = body.password
    var mobile:string = body.mobile
    var email:string = body.email
    var role_id:string = body.role_id
    if (password != '') {

      if (password.length < 6) {
        this.toolsService.error(res, `/${Config.adminPath}/manager/edit`, "密码长度不合法")
      } else {
        password = this.toolsService.getMd5(password)
        console.log("%c Line:85 🍻 password", "color:#2eafb0", password);
        const result = await this.adminService.update({
          ...body,
          password
        })
        if (result && result.code === "success") {
          this.toolsService.success(res, `/${Config.adminPath}/manager`);
        } else {
          this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);
        }

      }
    } else {

      const result = await this.adminService.update({
        userId,
        username,
        mobile,
        email,
        role_id
      })
      if (result && result.code === "success") {
        this.toolsService.success(res, `/${Config.adminPath}/manager`);
      } else {
        this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);
      }
    }
  }
  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = await this.adminService.delete(query.userId);
    if (result && result.code === "success") {
      this.toolsService.success(res, `/${Config.adminPath}/manager`);
    }
    this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);

  }
}
