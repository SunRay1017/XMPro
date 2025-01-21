import { Controller, Get, Render, Post, UseInterceptors, UploadedFile,Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from 'src/config/config';
import { GoodsService } from 'src/service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { ToolsService } from 'src/service/tools/tools.service';
import { GoodsColorService } from 'src/service/goods-color/goods-color.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
@Controller(`${Config.adminPath}/goods`)
export class GoodsController {

    constructor(private goodsService: GoodsService,private goodsTypeService: GoodsTypeService,private goodsCateService: GoodsCateService,private goodsColorService: GoodsColorService, private toolsService: ToolsService) { }
    @Get()
    @Render('admin/goods/index')
    async index() {

        var result = await this.goodsService.find();

        console.log(result);
        // return '商品模块';
        return {}
    }
    @Get("list")
    async getList(@Response() res) {

        var result = await this.goodsService.find();

        res.send({status:200,data:result})
    }

    @Get('add')
    @Render('admin/goods/add')
    async add() {
        const list = await this.goodsCateService.find()
        //  取出顶级模块
        const arr = list.filter(item => item.pid === "0")

        for (var j = 0; j < arr.length; j++) {
            arr[j]["items"] = []
            for (var i = 0; i < list.length; i++) {
                if (arr[j]._id === list[i].pid) {
                    arr[j]["items"].push(list[i])
                }

            }

        }
        // 獲取所有顏色
        const colors=await this.goodsColorService.find()

        // 獲取所有商品類型
        const types=await this.goodsTypeService.find()
        return {
            goodsCate: arr,
            goodsColor:colors,
            goodsType:types
        }
    }
    @Post('doUpload')
    @UseInterceptors(FileInterceptor('file'))
    async doUpload(@UploadedFile() file) {
        let { saveDir } = this.toolsService.uploadFile(file);
        return { link: '/' + saveDir };
    }
}
