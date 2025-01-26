import { Controller, Get, Render, Post, UseInterceptors, UploadedFile, Response, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Config } from 'src/config/config';
import { GoodsService } from 'src/service/goods/goods.service';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { ToolsService } from 'src/service/tools/tools.service';
import { GoodsColorService } from 'src/service/goods-color/goods-color.service';
import { GoodsTypeService } from 'src/service/goods-type/goods-type.service';
import { GoodsTypeAttributeService } from 'src/service/goods-type-attribute/goods-type-attribute.service';
import { GoodsImageService } from 'src/service/goods-image/goods-image.service';
import { GoodsAttrService } from 'src/service/goods-attr/goods-attr.service';

@Controller(`${Config.adminPath}/goods`)
export class GoodsController {

    constructor(private goodsImageService: GoodsImageService, private goodsAttrService: GoodsAttrService, private goodsService: GoodsService, private goodsTypeService: GoodsTypeService, private goodsCateService: GoodsCateService, private goodsColorService: GoodsColorService, private toolsService: ToolsService, private goodsTypeAttributeService: GoodsTypeAttributeService) { }
    // @Get()
    // @Render('admin/goods/index')
    // async index() {

    //     var result = await this.goodsService.find();

    //     console.log(result);
    //     // return '商品模块';
    //     return {}
    // }
    @Post("list")
    async getList(@Body() body,@Response() res) {

        var result = await this.goodsService.find(body);

        res.send({ status: 200, data: result })
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
        const colors = await this.goodsColorService.find()

        // 獲取所有商品類型
        const types = await this.goodsTypeService.find()
        return {
            goodsCate: arr,
            goodsColor: colors,
            goodsType: types
        }
    }

    @Get('getGoodsOptions')
    async getGoodsOptions(@Response() res) {
        const list = await this.goodsCateService.find()
        //  取出顶级模块
        const arr = list.filter(item => item.pid === "0")

        for (var j = 0; j < arr.length; j++) {
            arr[j]["children"] = []
            for (var i = 0; i < list.length; i++) {
                if (arr[j]._id === list[i].pid) {
                    arr[j]["children"].push(list[i])
                }

            }

        }
        // 獲取所有顏色
        const colors = await this.goodsColorService.find()

        // 獲取所有商品類型
        const types = await this.goodsTypeService.find()


        res.send({
            status: 200,
            msg: "",
            data: {
                goodsCate: arr,
                goodsColor: colors,
                goodsType: types
            }
        })
    }
    //富文本编辑器上传图片  图库上传图片
    @Post("doImageUpload")
    @UseInterceptors(FileInterceptor('file'))
    async doUpload(@UploadedFile() file, @Response() res) {
        let { saveDir, uploadDir } = this.toolsService.uploadFile(file);
        //缩略图
        if (uploadDir) {
            this.toolsService.jimpImg(uploadDir);
        }
        res.send({ link: '/' + saveDir })
    }
    //执行增加
    @Post("doAdd")
    @UseInterceptors(FileInterceptor('goods_img'))
    async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
        const data = { ...body }
        let { saveDir } = this.toolsService.uploadFile(file);
        //1、增加商品数据
        if (body.goods_color && typeof (body.goods_color) !== 'string') {
            body.goods_color = body.goods_color.join(',');
        }
        delete body.goods_attr_list
        delete body.goods_image_list
        var result = await this.goodsService.add(Object.assign({ ...body, is_hot: Number(body.is_hot), is_new: Number(body.is_new), is_best: Number(body.is_best), status: Number(body.status) }, {

            goods_img: saveDir
        }));
        //2、增加图库
        let goods_image_list = JSON.parse(data.goods_image_list);
        if (result._id && goods_image_list && typeof (goods_image_list) !== 'string') {
            for (var i = 0; i < goods_image_list.length; i++) {
                await this.goodsImageService.add({
                    goods_id: result._id,
                    img_url: goods_image_list[i]
                })
            }
        }


        //3、增加商品属性
        let goods_attr_list = JSON.parse(data.goods_attr_list);
        if (result._id && goods_attr_list && typeof (goods_attr_list) !== 'string') {

            for (var i = 0; i < goods_attr_list.length; i++) {
                //获取当前 商品类型id对应的商品类型属性
                let goodsTypeAttributeResult = await this.goodsTypeAttributeService.findById(goods_attr_list[i].attribute_id);
                await this.goodsAttrService.add({
                    goods_id: result._id,
                    //可能会用到的字段  开始
                    goods_cate_id: result.goods_cate_id,
                    attribute_id: goods_attr_list[i].attribute_id,
                    attribute_type: goodsTypeAttributeResult[0].attr_type,
                    //可能会用到的字段  结束
                    attribute_title: goodsTypeAttributeResult[0].title,
                    attribute_value: goods_attr_list[i].attribute_value,
                })
            }

        }
        res.send({ status: 200 })
        // this.toolsService.success(res, `/${Config.adminPath}/goods`);

    }

    @Post('getDetailsByGoodsId')
    async edit(@Body() body, @Response() res) {

        /*
        1、获取商品数据

        2、获取商品分类

        3、获取所有颜色 以及选中的颜色

        4、商品的图库信息

        5、获取商品类型

        6、获取规格信息
        */
        //1、获取商品数据
        var goodsResult: any = await this.goodsService.findOne(body.id);

        //4、商品的图库信息

        let goodsImageResult = await this.goodsImageService.find(goodsResult._id);


        // //5、获取商品类型


        //6、获取规格信息  商品类型属性

        let goodsAttrResult = await this.goodsAttrService.find(goodsResult._id);


        res.send({
            status: 200, data: {
                goods: goodsResult,
                goodsAttr: goodsAttrResult,
                goodsImage: goodsImageResult
            }
        })
    }
    //执行增加
    @Post("doEdit")
    @UseInterceptors(FileInterceptor('goods_img'))
    async doEdit(@Body() body, @UploadedFile() file, @Response() res) {

        console.log(body);
        const data = { ...body }

        //1、修改商品数据        
        let goods_id = body._id;
        //注意 goods_color的类型
        if (body.goods_color && typeof (body.goods_color) !== 'string') {
            body.goods_color = body.goods_color.join(',');
        }
        delete body.goods_attr_list
        delete body.goods_image_list
        if (file) {
            let { saveDir } = this.toolsService.uploadFile(file);
            await this.goodsService.update({
                "_id": goods_id,
                ...Object.assign(body, {
                    goods_img: saveDir
                })

            });
        } else {
            await this.goodsService.update({
                "_id": goods_id,
                ...body
            });
        }


        // 删除所有关联的相册
        // await this.goodsImageService.deleteMany({ "goods_id": goods_id })
        //2、修改图库数据 （增加）

        let goods_image_list = JSON.parse(data.goods_image_list);
        if (goods_id && goods_image_list && typeof (goods_image_list) !== 'string') {
            for (var i = 0; i < goods_image_list.length; i++) {
                await this.goodsImageService.add({
                    goods_id: goods_id,
                    img_url: goods_image_list[i]
                })
            }
        }

        // 3、修改商品类型属性数据         1、删除当前商品id对应的类型属性  2、执行增加


        // 3.1 删除当前商品id对应的类型属性
        await this.goodsAttrService.deleteMany({ "goods_id": goods_id })

        //3、增加商品属性
        let goods_attr_list = JSON.parse(data.goods_attr_list);
        if (goods_id && goods_attr_list && typeof (goods_attr_list) !== 'string') {

            for (var i = 0; i < goods_attr_list.length; i++) {
                //获取当前 商品类型id对应的商品类型属性
                let goodsTypeAttributeResult = await this.goodsTypeAttributeService.findById(goods_attr_list[i].attribute_id);
                await this.goodsAttrService.add({
                    goods_id: goods_id,
                    //可能会用到的字段  开始
                    goods_cate_id: body.goods_cate_id,
                    attribute_id: goods_attr_list[i].attribute_id,
                    attribute_type: goodsTypeAttributeResult[0].attr_type,
                    //可能会用到的字段  结束
                    attribute_title: goodsTypeAttributeResult[0].title,
                    attribute_value: goods_attr_list[i].attribute_value,
                })
            }

        }
        res.send({ status: 200 })

    }
}
