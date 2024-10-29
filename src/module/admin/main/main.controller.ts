import { Controller, Get, Render, Request,Query } from '@nestjs/common';
import { AccessService } from '../../../service/access/access.service';
import { RoleService } from '../../../service/role/role.service';
@Controller('admin/main')
export class MainController {
    constructor(private accessService: AccessService, private roleService: RoleService) { }

    @Get()
    @Render('admin/main/index')
    async index(@Request() req) {
        //1、获取j角色下的全部的权限
        var userinfo = req.session.userinfo;
        var role_id = userinfo.role_id;
        var accessResult = await this.roleService.queryAccess(role_id);

        var roleAccessArray = [];
        accessResult.forEach(value => {
            roleAccessArray.push(value.access_id.toString());
        });

        console.log(roleAccessArray);

        //    获取权限列表
        const list = await this.accessService.find()
        //  取出顶级模块
        const result: any = list.filter(item => item.module_id === "0")

        for (var j = 0; j < result.length; j++) {
            result[j]["items"] = []
            for (var i = 0; i < list.length; i++) {
                if (result[j].access_id === list[i].module_id) {
                    result[j]["items"].push(list[i])
                }

            }
        }

        // 3、循环遍历所有的权限数据，判断当前权限是否在角色权限的数组中,如果是的话给当前数据加入checked属性

        for (var i = 0; i < result.length; i++) {

            if (roleAccessArray.indexOf(result[i].access_id.toString()) != -1) {
                result[i].checked = true;
            }


            for (var j = 0; j < result[i].items.length; j++) {

                if (roleAccessArray.indexOf(result[i].items[j].access_id.toString()) != -1) {
                    result[i].items[j].checked = true;
                }
            }
        }
        console.log("%c Line:56 🌰 result", "color:#3f7cff", result);
        return {
            asideList: result

        };
    }

    @Get('welcome')
    @Render('admin/main/welcome')
    welcome() {
        return {};
    }
    @Get('changeStatus')
    async changeStatus(@Query() query) {
        
        //1、获取要修改数据的id
        //2、我们需要查询当前数据的状态 
        //3、修改状态   0 修改成 1    1修改成0

        // var model='focusService';
        var id=query.id;
        var model=query.model+"Service";   //要操作的数据模型  也就修改的表 focus
        var fields=query.fields;   //要修改的字段   status

        var json;
        var modelResult=await this[model].find({"_id":id});

        if(modelResult.length>0){
            var tempFields=modelResult[0][fields];

            tempFields==1?json={[fields]:0}:json={[fields]:1};   //es6的属性名表达式
            
            await this[model].update({"_id":id},json);
            return {
                success:true,
                message:'修改状态成功'
            };

        }else{
            return {
                success:false,
                message:'传入参数错误'
            };
        }


    }

}
