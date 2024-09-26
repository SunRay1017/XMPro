import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { RoleService } from '../../../service/role/role.service';

import { ToolsService } from '../../../service/tools/tools.service';

import { Config } from '../../../config/config'
@Controller(`${Config.adminPath}/role`)
export class RoleController {

    constructor(private roleService: RoleService, private toolsService: ToolsService) { }

    @Get()
    @Render('admin/role/index')
    async index() {
        var result = await this.roleService.find();
        console.log("%c Line:16 🍭 result", "color:#b03734", result);

        return {
            roleList: result||[]
        };
    }

    @Get('add')
    @Render('admin/role/add')
    async add() {
        return {};
    }

    @Post('doAdd')
    async doAdd(@Body() body, @Response() res) {
      console.log("%c Line:31 🥖 body", "color:#6ec1c2", body);

        console.log(body);

        if (body.title != '') {
            var result = await this.roleService.add(body);

            if (result&&result.code==="success") {

                this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg,);

            }
        } else {
            this.toolsService.error(res, `/${Config.adminPath}/role`, '标题不能为空',);
        }

    }


    @Get('edit')
    @Render('admin/role/edit')
    async edit(@Query() query) {
        var result = await this.roleService.findOne(query.role_id);
        console.log("%c Line:56 🍞 result", "color:#3f7cff", result);
        return {
            roleList: result
        };
    }

    @Post('doEdit')
    async doEdit(@Body() body, @Response() res) {
        if (body.title != '') {
            var result = await this.roleService.update(body);
            console.log("%c Line:65 🥛 result", "color:#465975", result);
            if (result&&result.code==="success") {
                this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                this.toolsService.error(res,`/${Config.adminPath}/role`, result.msg );
            }

        } else {
            this.toolsService.error(res,`/${Config.adminPath}/role`, '标题不能为空');
        }
    }


    @Get('delete')  
    async delete(@Query() query,@Response() res) {
        var result = await this.roleService.delete(query.role_id);
        console.log(result);
        if(result&&result.code==="success"){
          this.toolsService.success(res, `/${Config.adminPath}/role`);
        }
        this.toolsService.error(res,`/${Config.adminPath}/role`,result.msg);
        
    }
}
