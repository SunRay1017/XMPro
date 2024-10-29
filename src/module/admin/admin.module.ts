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
import { GoodsTypeAttribute } from '../../schema/goods_type_attribute.entity';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,Role,Access,RoleAccess,Focus,GoodsType,GoodsTypeAttribute]),
  ],
  controllers: [MainController, LoginController, ManagerController,RoleController,AccessController, FocusController, GoodsTypeController, GoodsTypeAttributeController],
  providers: [ToolsService,AdminService,RoleService,AccessService,FocusService,GoodsTypeService,GoodsTypeAttributeService],
  exports:[ToolsService,AdminService,RoleService,AccessService,FocusService]
})
export class AdminModule {}
