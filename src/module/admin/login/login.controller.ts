import { Controller, Get, Render, Request, Response, Post, Body,UseGuards} from '@nestjs/common';
import { ToolsService } from 'src/service/tools/tools.service';
import { AdminService } from 'src/service/admin/admin.service';
import { Config } from '../../../config/config'
import {JwtService} from "@nestjs/jwt"
import { AuthGuard } from '@nestjs/passport';

@Controller(`${Config.adminPath}/login`)
export class LoginController {
  constructor(private toolService: ToolsService, private adminService: AdminService, private jwtService: JwtService,) { }
  @Get()
  @Render("admin/login")
  async index() {
    return {};
  }
  // @UseGuards(NoAuthGuard)
  @Get("code")
  getCode(@Request() req, @Response() res) {
    var svgCaptcha = this.toolService.getCaptcha()
    req.session.code = svgCaptcha.text
    res.type("image/svg+xml")
    res.send(svgCaptcha.data)
  }
  // @UseGuards(AuthGuard('local'))
  @Post("doLogin")
  async doLogin(@Body() body, @Request() req, @Response() res) {

    try {
      var username = body.username
      var password = body.password
      // var code: string = body.code
      // if (code.toUpperCase() == req.session.code.toUpperCase()) {
       
      // }

      password = this.toolService.getMd5(password)
      const user = await this.adminService.findOne({ "username": username, "password": password })
      if (user) {
        const payload = { userId: user.userId, password: password,username:username };
        res.send({
          msg: '登录成功',
          status:200,
          data: {
            user: user,
            token: this.jwtService.sign(payload)
          }
        })

      }
      // if (username == "" || password.length < 6) {
      //   this.toolService.error(res, `/${Config.adminPath}/login`, "用户名或密码不合法")
      // } else {
      //   if (code.toUpperCase() == req.session.code.toUpperCase()) {
      //     password = this.toolService.getMd5(password)
      //     const resuslt = await this.adminService.findOne({ "username": username, "password": password })
      //     console.log("%c Line:35 🥕 resuslt", "color:#ffdd4d", resuslt);
      //     if (resuslt) {
      //       req.session.userinfo = resuslt
      //       // res.send({
      //       //   status: 200,
      //       //   msg: "登录成功！"
      //       // })
      //       this.toolService.success(res, `/${Config.adminPath}/main`)
      //     } else {
      //       this.toolService.error(res, `/${Config.adminPath}/login`, "用户名或密码不正确")
      //     }
      //   } else {
      //     this.toolService.error(res, `/${Config.adminPath}/login`, "验证码不正确")
      //   }
      // }


    } catch (error) {
      // res.redirect(`/${Config.adminPath}/login`)
    }
  }
  // @Get("loginOut")
  // doLoginOut(@Request() req, @Response() res) {
  //   req.session.userinfo = null
  //   res.redirect(`/${Config.adminPath}/login`)
  // }
}
