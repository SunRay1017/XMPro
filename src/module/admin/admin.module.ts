import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../../schema/admin.entity';
import { Role } from '../../schema/role.entity';
import { RoleAccess } from '../../schema/role_access.entity';
import { Access } from '../../schema/access.entity';
import { Focus } from '../../schema/focus.entity';
import { GoodsType } from '../../schema/goods_type.entity';
import { GoodsColor } from '../../schema/goods_color.entity';
import { GoodsTypeAttribute } from '../../schema/goods_type_attribute.entity';
import { GoodsCate } from '../../schema/goods_cate.entity';
import { Goods } from '../../schema/goods.entity';
import { AdminService } from 'src/service/admin/admin.service';
import { RoleService } from 'src/service/role/role.service';
import { RoleController } from './role/role.module';
import {AccessService} from "src/service/access/access.service"
import {FocusService} from "src/service/focus/focus.service"
import { AccessController } from './access/access.controller';
import { FocusController } from './focus/focus.controller';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { GoodsTypeController } from './goods-type/goods-type.controller';
import { GoodsTypeAttributeController } from './goods-type-attribute/goods-type-attribute.controller';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsCateController } from './goods-cate/goods-cate.controller';
import { GoodsCateService } from 'src/service/goods-cate/goods-cate.service';
import { GoodsController } from './goods/goods.controller';
import { GoodsService } from 'src/service/goods/goods.service';
import { GoodsColorController } from './goods-color/goods-color.controller';
import { GoodsColorService } from 'src/service/goods-color/goods-color.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/module/admin/login/local.strategy';
import { JwtStrategy } from 'src/module/admin/login/jwt.strategy';
// import { NoAuthGuard } from "src/guards/noAuthGuard.guard"
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,Role,Access,RoleAccess,Focus,GoodsType,GoodsTypeAttribute,GoodsCate,Goods,GoodsColor]),
    JwtModule.register({
      secret:"xylxm",
      signOptions: { expiresIn: '3d' },
      
    }),
    PassportModule
  ],
  controllers: [MainController, LoginController, ManagerController,RoleController,AccessController, FocusController, GoodsTypeController, GoodsTypeAttributeController, GoodsCateController, GoodsController, GoodsColorController],
  providers: [ToolsService,AdminService,RoleService,AccessService,FocusService,GoodsTypeService,GoodsTypeAttributeService,GoodsCateService,GoodsService,GoodsColorService,LocalStrategy,JwtStrategy],//
  exports:[ToolsService,AdminService,RoleService,AccessService,FocusService]
})
export class AdminModule {}
