import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './module/admin/admin.module';
import { DefaultModule } from './module/default/default.module';
import { ApiModule } from './module/api/api.module';
// import { AdminauthMiddleware } from "./middleware/adminauth/adminauth.middleware"
import {InitMiddleware} from './middleware/init/init.middleware';
import { Config } from './config/config';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: "1.95.40.201",
    port: 3306,
    username: 'app1',
    password: 'xyl100517',
    database: 'xiaomi',
    charset: "utf8mb4", // 设置chatset编码为utf8mb4
    autoLoadEntities: true,
    synchronize: true
  }), AdminModule, DefaultModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(AdminauthMiddleware)
      // .forRoutes(`${Config.adminPath}/*`)
      .apply(InitMiddleware)
      .forRoutes('*');
  }
}
