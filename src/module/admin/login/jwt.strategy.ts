import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';
import { AdminService } from 'src/service/admin/admin.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: "xylxm",
    });
  }

  async validate(payload: any) {
    const user = await this.adminService.findOne({ userId: payload.userId, username: payload.username, password: payload.password })
    if (!user) {
      return false;
    }
    return { userId: payload.userId, username: payload.username, password: payload.password };
  }
}