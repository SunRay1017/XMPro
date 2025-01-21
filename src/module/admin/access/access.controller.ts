import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config'
import { ToolsService } from '../../../service/tools/tools.service';
import { AccessService } from '../../../service/access/access.service';
@Controller(`${Config.adminPath}/access`)
export class AccessController {
  constructor(private toolsService: ToolsService, private accessService: AccessService) { }
  @Get()
  @Render("admin/access/index")
  async index() {
    const list = await this.accessService.find()
    console.log("%c Line:12 🥚 list", "color:#ea7e5c", list);
    //  取出顶级模块
    const arr = list.filter(item => item.module_id === "0")

    for (var j = 0; j < arr.length; j++) {
      arr[j]["items"] = []
      for (var i = 0; i < list.length; i++) {
        if (arr[j].access_id === list[i].module_id) {
          arr[j]["items"].push(list[i])
        }

      }
    }
    return {
      list: arr
    }
  };

  @Get("list")
  async getlist(@Response() res) {
    const list = await this.accessService.find()
    //  取出顶级模块
    const arr = list.filter(item => item.module_id === "0")

    for (var j = 0; j < arr.length; j++) {
      arr[j]["children"] = []
      for (var i = 0; i < list.length; i++) {
        if (arr[j].access_id === list[i].module_id) {
          arr[j]["children"].push(list[i])
        }

      }
    }
    res.send({
      status: 200,
      msg: "",
      data: arr
    })
  };
  @Get('add')
  @Render("admin/access/add")
  async add() {
    const list = await this.accessService.findModules()
    return {
      moduleList: list
    }
  };
  @Get('getModules')
  async getModules(@Response() res) {
    const list = await this.accessService.findModules()
    const arr = list.map(item => ({
      module_id: item.access_id,
      module_name: item.module_name
    }))
    const result = [{
      module_id: "0",
      module_name: "顶级模块"
    }, ...arr]

    res.send({
      status: 200,
      msg: "",
      data: result
    })
  };

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {


    if (body.type) {
      var result = await this.accessService.add(body);

      if (result && result.code === "success") {
        res.send({
          status: 200,
          msg: "",
        })
        // this.toolsService.success(res, `/${Config.adminPath}/access`);
      } else {
        // this.toolsService.error(res, `/${Config.adminPath}/access`, result.msg,);

      }
    } else {
      // this.toolsService.error(res, `/${Config.adminPath}/access`, 'url不能为空',);
    }

  }

  @Get('edit')
  @Render("admin/access/edit")
  async edit(@Query() query) {
    const moduleList = await this.accessService.findModules();
    const list = await this.accessService.findRecord(query.id)
    return {
      moduleList,
      list
    }
  };
  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    const result = await this.accessService.update(body);

    if (result && result.code === "success") {
      res.send({
        status: 200,
        msg: "",
      })
      // this.toolsService.success(res, `/${Config.adminPath}/access`);
    } else {
      // this.toolsService.error(res, `/${Config.adminPath}/access`, result.msg,);

    }
  }
  @Post('delete')
  async delete(@Body() body, @Response() res) {
    var result = await this.accessService.delete(body.id);
    if (result && result.code === "success") {
      res.send({
        status: 200,
        msg: "",
      })
    }
    // this.toolsService.error(res, `/${Config.adminPath}/access`, result.msg);

  }
}
