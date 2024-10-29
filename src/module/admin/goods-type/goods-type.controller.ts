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

  @Get('add')
  @Render('admin/goodsType/add')
  async add() {

    return {};
  }

  @Post('doAdd')
  async doAdd(@Body() body, @Response() res) {
    await this.goodsTypeService.add(body);
    this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
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


    await this.goodsTypeService.update(body);

    this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
  }

  @Get('delete')
  async delete(@Query() query, @Response() res) {
    var result = await this.goodsTypeService.delete(query.id);
    this.toolsService.success(res, `/${Config.adminPath}/goodsType`);
  }
}
