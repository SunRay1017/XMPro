import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';
import { ToolsService } from '../../service/tools/tools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../../schema/admin.entity';
import { Role } from '../../schema/role.entity';
import { Access } from '../../schema/access.entity';
import { AdminService } from 'src/service/admin/admin.service';
import { RoleService } from 'src/service/role/role.service';
import { RoleController } from './role/role.module';
import {AccessService} from "src/service/access/access.service"
import { AccessController } from './access/access.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([Admin,Role,Access]),
  ],
  controllers: [MainController, LoginController, ManagerController,RoleController,AccessController],
  providers: [ToolsService,AdminService,RoleService,AccessService],
})
export class AdminModule {}
