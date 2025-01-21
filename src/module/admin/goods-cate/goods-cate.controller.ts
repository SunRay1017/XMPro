import { Controller, Get, Render, Post, Body, Response, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Config } from '../../../config/config';
import { GoodsCateService } from '../../../service/goods-cate/goods-cate.service';
import { ToolsService } from '../../../service/tools/tools.service';

@Controller(`${Config.adminPath}/goodsCate`)


export class GoodsCateController {

  constructor(private goodsCateService: GoodsCateService, private toolsService: ToolsService) { }


  @Get()
  @Render('admin/goodsCate/index')
  async index() {
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
    console.log("%c Line:12 🥚 list", "color:#ea7e5c", arr);

    return {
      list: arr
    }
  }
  @Get("list")
  async list(@Response() res) {
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
    res.send({
      status: 200,
      msg: "",
      data: arr
    })

  }

  @Get('add')
  @Render('admin/goodsCate/add')
  async add() {
    var result = await this.goodsCateService.findByPid("0");
    return {
      cateList: result
    };
  }
  @Get('getTopCates')
  async getTopCates(@Response() res) {
    var list = await this.goodsCateService.findByPid("0");
    const arr = list.map(item => ({
      label: item.title,
      value: item._id
    }))
    const result = [{
      value: "0",
      label: "顶级分类"
    }, ...arr]

    res.send({
      status: 200,
      msg: "",
      data: result
    })
    // return {
    //   cateList: result
    // };
  }

  @Post('doAdd')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    // console.log("%c Line:94 🍔 file", "color:#fca650", file);
    // console.log("%c Line:94 🍺 body", "color:#f5ce50", body);


    let { saveDir, uploadDir } = this.toolsService.uploadFile(file);
    try {

      await this.goodsCateService.add({ ...body, cate_img: saveDir });
      if (uploadDir) {
        this.toolsService.jimpImg(uploadDir)
      }
      res.send({
        status: 200,

      })
      // this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);

    } catch (error) {
      console.log(error);
      // this.toolsService.error(res, '非法请求', `/${Config.adminPath}/goodsCate/add`);

    }

  }
  @Get('edit')
  @Render('admin/goodsCate/edit')
  async edit(@Query() query) {

    //获取所有的以及分类
    try {
      var cateList = await this.goodsCateService.findByPid("0");

      var result = await this.goodsCateService.findOne(query.id);

      console.log(result);

      return {
        cateList: cateList,
        list: result
      };

    } catch (error) {
      return error;
    }

  }

  @Post('doEdit')
  @UseInterceptors(FileInterceptor('cate_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {

    let id = body._id;
    try {



      if (file) {

        let { saveDir, uploadDir } = this.toolsService.uploadFile(file);
        await this.goodsCateService.update({ ...body, cate_img: saveDir });
        if (uploadDir) {
          this.toolsService.jimpImg(uploadDir)
        }
      } else {
        await this.goodsCateService.update(body);
      }
      res.send({
        status: 200,

      })
      // this.toolsService.success(res, `/${Config.adminPath}/goodsCate`);
    } catch (error) {
      // console.log("%c Line:110 🍰 error", "color:#7f2b82", error);
      // this.toolsService.error(res, '修改失败', `/${Config.adminPath}/goodsCate/edit?id=${id}`);
    }


  }


  @Post('delete')
  async delete(@Body() body, @Response() res) {
    let result = await this.goodsCateService.delete(body.id);
    res.send({
      status: 200,

    })
  }
}
