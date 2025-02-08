import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express"
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from "path"
import * as cookieParser from "cookie-parser"
import * as session from "express-session"
async function bootstrap() {
  const app: any = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors()
  // 设置项目静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 设置视图目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  // 设置前端页面解析模板
  app.setViewEngine('ejs');
  // 设置cookie
  app.use(cookieParser("this is signed"))
  // 设置session
  app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 1000 * 60 * 30, httpOnly: true },
    resave: true,
    saveUninitialized: true,
    rolling: true
  }))
  const options = new DocumentBuilder()
    .setTitle('FS_ADMIN') // 标题
    .setDescription('后台管理系统接口文档') // 描述
    .setVersion('1.0') // 版本
    .build();

  const document = SwaggerModule.createDocument(app, options);
  //配置swgger地址
  SwaggerModule.setup('/fs_admin/api', app, document);
  await app.listen(3000);
}
bootstrap();
