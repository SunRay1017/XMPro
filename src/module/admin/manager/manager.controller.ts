import { Controller, Get, Render, Post, Body, Response, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Config } from '../../../config/config'
import { RoleService } from '../../../service/role/role.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { AdminService } from 'src/service/admin/admin.service';
import { EventsGateway } from '../events/events.gateway';
@Controller(`${Config.adminPath}/manager`)
export class ManagerController {
  constructor(private roleService: RoleService, private toolsService: ToolsService, private adminService: AdminService,private eventsGateWay:EventsGateway) { }

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
  // @UseGuards(AuthGuard('jwt'))
  @Get("list")
  async getManagerList(@Response() res) {
this.eventsGateWay.server.emit("message","hello client")
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
    //  const list= adminList.map(item => ({
    //     title: item.title,
    //     mobile: item.mobile,
    //     email: item.email,
    //     userId: item.userId,
    //     role_id: item.role_id,
    //     role_name: item.role_nam
    //   }))
    res.send({
      status: 200,
      msg: "",
      data: adminList
    })
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
      res.send({
        status: 200,
        errMsg: "用户名或者密码长度不合法"
      })
      // this.toolsService.error(res, `/${Config.adminPath}/manager/add`, '用户名或者密码长度不合法',);
    } else {
      //从数据库查询当前用户名是否存在
      var adminResult = await this.adminService.findOne({ "username": body.username });

      if (adminResult) {
        res.send({
          status: 200,
          errMsg: "管理员已存在"
        })
        // this.toolsService.error(res, `/${Config.adminPath}/manager/add`, '此管理已经存在',);
      } else {
        body.password = this.toolsService.getMd5(body.password);
        this.adminService.add(body);
        res.send({
          status: 200,
          errMsg: "",
        })
        // this.toolsService.success(res, `/${Config.adminPath}/manager`);
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

    var userId: string = body.userId
    var username: string = body.username
    var password: string = body.password||""
    var mobile: string = body.mobile
    var email: string = body.email
    var role_id: string = body.role_id
    if (password != '') {

      if (password.length < 6) {
        this.toolsService.error(res, `/${Config.adminPath}/manager/edit`, "密码长度不合法")
      } else {
        //从数据库查询当前用户名是否存在
        var adminResult = await this.adminService.findOne({ "username": body.username });

        if (adminResult) {
          res.send({
            status: 200,
            errMsg: "管理员已存在"
          })
        } else {
          password = this.toolsService.getMd5(password)
          const result = await this.adminService.update({
            ...body,
            password
          })
          if (result && result.code === "success") {
            res.send({
              status: 200,
            })
            // this.toolsService.success(res, `/${Config.adminPath}/manager`);
          } else {
            // this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);
          }
        }


      }
    } else {
      //从数据库查询当前用户名是否存在
      var adminResult = await this.adminService.findOne({ "username": body.username });
      if (adminResult) {
        res.send({
          status: 200,
          errMsg: "管理员已存在"
        })
      } else {
        const result = await this.adminService.update({
          userId,
          username,
          mobile,
          email,
          role_id
        })
        if (result && result.code === "success") {
          res.send({
            status: 200,
          })
          // this.toolsService.success(res, `/${Config.adminPath}/manager`);
        } else {
          // this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);
        }
      }

    }
  }
  @Post('delete')
  async delete(@Body() body, @Response() res) {
    var result = await this.adminService.delete(body.id);
    if (result && result.code === "success") {
      res.send({
        status: 200,
      })
      // this.toolsService.success(res, `/${Config.adminPath}/manager`);
    }
    // this.toolsService.error(res, `/${Config.adminPath}/manager`, result.msg);

  }
}
