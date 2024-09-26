import { Injectable } from '@nestjs/common';
import * as svgCaptcha from "svg-captcha";
import * as md5 from "md5"
@Injectable()
export class ToolsService {
  getCaptcha() {
    var captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: "#87e8de"
    });
    return captcha;
  }
  getMd5(str: string) {
    return md5(str)
  }
  async success(res,redirectUrl){
    await res.render("admin/public/success",{
      redirectUrl:redirectUrl
    })
  }
  async error(res,redirectUrl,message){
    await res.render("admin/public/error",{
      message:message,
      redirectUrl:redirectUrl
    })
  }
}
