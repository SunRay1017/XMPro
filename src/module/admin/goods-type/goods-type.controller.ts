import { Controller, Get, Render, Post, Body, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config'
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsType`)
export class GoodsTypeController {
  constructor(private goodsTypeService: GoodsTypeService, private toolsService: ToolsService) { }
  @Get()
  @Render("admin/goodsType/index")
  async index() {
    var result = await this.goodsTypeService.find();
    return {
      list: result
    };
  };
  @Get("list")
  async getList(@Response() res) {
    var result = await this.goodsTypeService.find();
    res.send({
      status: 200,
      msg: "",
      data: result
    })
  };

  @Get('add')
  @Render('admin/goodsType/add')
  async add() {

    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    await this.goodsTypeService.add(body);
    res.send({
      status: 200,

    })
    // this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
  }
  @Get('edit')
  @Render('admin/goodsType/edit')
  async edit(@Query() query) {
    var result = await this.goodsTypeService.findOne(query.id);
    return {
      list: result
    };
  }

  @Post('doEdit')
  async doEdit(@Body() body, @Response() res) {
    console.log("%c Line:54 🥔 body", "color:#7f2b82", body);


    await this.goodsTypeService.update(body);

    res.send({
      status: 200,

    })
  }

  @Post('delete')
  async delete(@Body() body, @Response() res) {
    var result = await this.goodsTypeService.delete(body.id);
    res.send({
      status: 200,

    })
  }
}
