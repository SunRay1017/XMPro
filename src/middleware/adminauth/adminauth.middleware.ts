import { Injectable, NestMiddleware } from '@nestjs/common';
import { Config } from 'src/config/config';
import { AdminService } from 'src/service/admin/admin.service';
@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  constructor(private adminService: AdminService) { }

  async use(req: any, res: any, next: () => void) {
    // h获取请求路径
    var pathname=req.baseUrl
    console.log("%c Line:11 🥒 pathname", "color:#fca650", pathname);
    // 获取session里面保存的心用户信息
    var userinfo=req.session.userinfo
    if(userinfo&&userinfo.username){
      res.locals.userinfo=userinfo
      var hasAuth=await this.adminService.checkAuth(req);
      // console.log(hasAuth);
      if(hasAuth){
        next();
      }else{
        res.send('您没有权限访问当前地址');
      } 
    }else{
      if(pathname==`/${Config.adminPath}/login`||pathname==`/${Config.adminPath}/login/code`||pathname==`/${Config.adminPath}/login/doLogin`){
        next()
      }else{
        res.redirect(`/${Config.adminPath}/login`)
      }
     
    }
  }
}
