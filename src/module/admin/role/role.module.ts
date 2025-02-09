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
    @Get("list")

    async getList(@Response() res) {
        var result = await this.roleService.find();

        res.send({
            status: 200,
            msg: "",
            data: result
        })
    }

    @Get('add')
    @Render('admin/role/add')
    async add() {
        return {};
    }

    @Post('doAdd')
    async doAdd(@Body() body, @Response() res) {
        if (body.title != '') {
            var result = await this.roleService.add(body);

            if (result && result.code === "success") {
                res.send({
                    status: 200,
                    msg: "",
                })

                // this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                // this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg,);

            }
        } else {
            // this.toolsService.error(res, `/${Config.adminPath}/role`, '标题不能为空',);
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
                res.send({
                    status: 200,
                    msg: "",
                })
                // this.toolsService.success(res, `/${Config.adminPath}/role`);
            } else {
                // this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg);
            }

        } else {
            // this.toolsService.error(res, `/${Config.adminPath}/role`, '标题不能为空');
        }
    }


    @Post('delete')
    async delete(@Body() body, @Response() res) {
        var result = await this.roleService.delete(body.id);
        if (result && result.code === "success") {
            res.send({
                status: 200,
                msg: "",
            })
            // this.toolsService.success(res, `/${Config.adminPath}/role`);
        }
        // this.toolsService.error(res, `/${Config.adminPath}/role`, result.msg);

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
    @Get('getAuthList')
    async getAuthList(@Response() res) {
        // 获取改角色下的所有权限
        const list = await this.accessService.find()
        const transList = list.map(item => ({
            title: item.action_name,
            key: item.access_id,
            module_id: item.module_id
        }))
        //  取出顶级模块
        const arr: any = transList.filter(item => item.module_id === "0")

        for (var j = 0; j < arr.length; j++) {
            arr[j]["children"] = []
            for (var i = 0; i < transList.length; i++) {
                if (arr[j].key === transList[i].module_id) {
                    arr[j]["children"].push(transList[i])
                }

            }
        }
        res.send({
            status: 200,
            msg: "",
            data: arr
        })


    }
    @Post('getAccessByRoleId')
    async getAccessByRoleId(@Body() body, @Response() res) {
        const accessRes = await this.roleService.queryAccess(body.role_id)
        // 查询所有的权限列表，用来翻译
        const list = await this.accessService.find()
        for (let i = 0; i < accessRes.length; i++) {
            for (let j = 0; j < list.length; j++) {
                if (accessRes[i].access_id === list[j].access_id) {
                    accessRes[i] = { ...accessRes[i], ...list[j] }
                }
            }
        }
        res.send({
            status: 200,
            msg: "",
            data: accessRes
        })
    }
    @Post('doAuth')
    async doAuth(@Body() body, @Response() res) {
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
        res.send({
            status: 200,
            msg: "",
        })
        // this.toolsService.success(res, `/${Config.adminPath}/role/auth?role_id=${role_id}`);
    }
}
