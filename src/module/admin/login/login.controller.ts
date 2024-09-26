import { Controller, Get, Render, Request, Response, Post, Body } from '@nestjs/common';
import { ToolsService } from 'src/service/tools/tools.service';
import { AdminService } from 'src/service/admin/admin.service';
import {Config} from '../../../config/config'

@Controller(`${Config.adminPath}/login`)
export class LoginController {
  constructor(private toolService: ToolsService, private adminService: AdminService) { }
  @Get()
  @Render("admin/login")
  async index() {
    return {};
  }

  @Get("code")
  getCode(@Request() req, @Response() res) {
    var svgCaptcha = this.toolService.getCaptcha()
    req.session.code = svgCaptcha.text
    res.type("image/svg+xml")
    res.send(svgCaptcha.data)
  }
  @Post("doLogin")
  async doLogin(@Body() body, @Request() req, @Response() res) {
    try {
      var username = body.username
      var password = body.password
      var code: string = body.code

      if (username == "" || password.length < 6) {
        this.toolService.error(res, `/${Config.adminPath}/login`, "用户名或密码不合法")
      } else {
        if (code.toUpperCase() == req.session.code.toUpperCase()) {
          password = this.toolService.getMd5(password)
          const resuslt = await this.adminService.findOne({ "username": username, "password": password })
          console.log("%c Line:35 🥕 resuslt", "color:#ffdd4d", resuslt);
          if (resuslt) {
            req.session.userinfo = resuslt
            this.toolService.success(res, `/${Config.adminPath}/main`)
          } else {
            this.toolService.error(res, `/${Config.adminPath}/login`, "用户名或密码不正确")
          }
        } else {
          this.toolService.error(res, `/${Config.adminPath}/login`, "验证码不正确")
        }
      }
    } catch (error) {
      res.redirect(`/${Config.adminPath}/login`)
    }
  }
  @Get("loginOut")
  doLoginOut(@Request() req,@Response() res){
    req.session.userinfo=null
    res.redirect(`/${Config.adminPath}/login`)
  }
}
