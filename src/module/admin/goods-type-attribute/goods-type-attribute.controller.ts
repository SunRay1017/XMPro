import { Controller, Get, Render, Query, Post, Body, Response } from '@nestjs/common';
import { Config } from '../../../config/config';
import { GoodsTypeAttributeService } from '../../../service/goods-type-attribute/goods-type-attribute.service';
import { GoodsTypeService } from '../../../service/goods-type/goods-type.service';
import { ToolsService } from '../../../service/tools/tools.service';
@Controller(`${Config.adminPath}/goodsTypeAttribute`)

export class GoodsTypeAttributeController {

    constructor(private goodsTypeAttributeService: GoodsTypeAttributeService, private toolsService: ToolsService, private goodsTypeService: GoodsTypeService) { }

    @Get()
    @Render('admin/goodsTypeAttribute/index')
    async index(@Query() query) {
        //商品类型 id
        var id = query.id;
        var goodsTypeResult = await this.goodsTypeService.findOne(id);

        var goodsTypeAttributeResult = await this.goodsTypeAttributeService.find(id);


        return {
            goodsType: goodsTypeResult,
            list: goodsTypeAttributeResult
        };

    }
    @Post("list")
    async getList(@Body() body, @Response() res) {
        //商品类型 id
        var id = body.id;
        var goodsTypeResult = await this.goodsTypeService.findOne(id);

        var goodsTypeAttributeResult = await this.goodsTypeAttributeService.find(id);


        res.send({ status: 200, data: { goodsType: goodsTypeResult, list: goodsTypeAttributeResult } })

    }
    @Get('add')
    @Render('admin/goodsTypeAttribute/add')
    async add(@Query() query) {
        //商品类型 id
        var id = query.id;
        //获取所有的商品类型
        var goodsTypeResult = await this.goodsTypeService.find();
        return {
            goodsTypes: goodsTypeResult,
            cate_id: id
        };
    }

    @Post('doAdd')
    async doAdd(@Body() body, @Response() res) {
        var result = await this.goodsTypeAttributeService.add(body);
        if (result) {
            res.send({ status: 200 })

            // this.toolsService.success(res, `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`);
        } else {
            // this.toolsService.error(res, '增加失败', `/${Config.adminPath}/goodsTypeAttribute?id=${body.cate_id}`);
        }
    }

    @Get('edit')
    @Render('admin/goodsTypeAttribute/edit')
    async edit(@Query() query) {
        // 属性 id
        var id = query.id;
        //获取要修改的数据
        var goodsTypeAttributeResult = await this.goodsTypeAttributeService.findOne(id);

        //获取所有的商品类型
        var goodsTypeResult = await this.goodsTypeService.find();

        return {
            goodsTypes: goodsTypeResult,
            goodsTypeAttribute: goodsTypeAttributeResult
        };
    }

    @Post('doEdit')
    async doEdit(@Body() body, @Response() res) {
        var id = body._id;

        body.attr_type != 3 ? body.attr_value = '' : '';

        var result = await this.goodsTypeAttributeService.update(body);
        if (result) {
            res.send({ status: 200 })
        } else {
        }
    }

    @Post('delete')
    async delete(@Body() body, @Response() res) {
        var result = await this.goodsTypeAttributeService.delete(body.id);
        res.send({ status: 200 })
    }

}

