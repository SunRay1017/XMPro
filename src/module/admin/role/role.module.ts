import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { RoleService } from '../../../service/role/role.service';

import { ToolsService } from '../../../service/tools/tools.service';
import { AccessService } from '../../../service/access/access.service';
import { Config } from '../../../config/config'
@Controller(`${Config.adminPath}/role`)
export class RoleController {

    constructor(private roleService: RoleService, private toolsService: ToolsService, private accessService: AccessService) { }

    @Get()
    @Render('admin/role/index')
    async index() {
        var result = await this.roleService.find();
        console.log("%c Line:16 🍭 result", "color:#b03734", result);

        return {
            roleList: result || []
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

            if (result && result.code === "success") {

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
            if (result && result.code === "success") {
                this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg);
            }

        } else {
            this.toolsService.error(res, `/${Config.adminPath}/role`, '标题不能为空');
        }
    }


    @Get('delete')
    async delete(@Query() query, @Response() res) {
        var result = await this.roleService.delete(query.role_id);
        console.log(result);
        if (result && result.code === "success") {
            this.toolsService.success(res, `/${Config.adminPath}/role`);
        }
        this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg);

    }
    @Get('auth')
    @Render('admin/role/auth')
    async auth(@Query() query) {
        // 获取改角色下的所有权限
        const list = await this.accessService.find()
        //  取出顶级模块
        const arr: any = list.filter(item => item.module_id === "0")

        for (var j = 0; j < arr.length; j++) {
            arr[j]["items"] = []
            for (var i = 0; i < list.length; i++) {
                if (arr[j].access_id === list[i].module_id) {
                    arr[j]["items"].push(list[i])
                }

            }
        }

        // 查出所有权限
        const accessList = []
        const accessRes = await this.roleService.queryAccess(query.role_id)
        accessRes.forEach(item => {
            accessList.push(item.access_id)
        })
        for (let i = 0; i < arr.length; i++) {
            if (accessList.indexOf(arr[i].access_id) != -1) {
                arr[i].checked = true
            }

            for (let j = 0; j < arr[i].items.length; j++) {
                if (accessList.indexOf(arr[i].items[j].access_id) != -1) {
                    arr[i].items[j].checked = true
                }
            }
        }
        return {
            list: arr,
            role_id: query.role_id
        }

    }
    @Post('doAuth')
    async doAuth(@Body() body, @Response() res) {
        console.log(body);

        var role_id = body.role_id;

        var access_node = body.access_node;
        console.log("%c Line:137 🍇 access_node", "color:#4fff4B", access_node);

        //1、删除当前角色下面的所有权限

        await this.roleService.deleteMany(role_id);
        if (!access_node) return
        //2、把当前角色对应的所有权限增加到role_access表里面
        for (var i = 0; i < access_node.length; i++) {

            await this.roleService.addAccess({
                role_id: role_id,
                access_id: access_node[i]
            })
        }
        this.toolsService.success(res, `/${Config.adminPath}/role/auth?role_id=${role_id}`);
    }
}
