import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors, Response, Query } from '@nestjs/common';
import { Config } from '../../../config/config'
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolsService } from '../../../service/tools/tools.service';
import { FocusService } from '../../../service/focus/focus.service';

@Controller(`${Config.adminPath}/focus`)
export class FocusController {
  constructor(private toolsService: ToolsService, private focusService: FocusService) { }

  @Get()
  @Render('admin/focus/index')
  async index() {
    let result = await this.focusService.find();
    return {
      focusList: result
    };

  }
  @Get("list")
  async getList(@Response() res) {
    let result = await this.focusService.find();

    res.send({
      status: 200,
      msg: "",
      data: result
    })
  }
  @Get("add")
  @Render('admin/focus/add')
  add() {
    return {

    };
  }
  @Post("doAdd")
  @UseInterceptors(FileInterceptor("focus_img"))
  async doAdd(@Body() body, @UploadedFile() file, @Response() res) {
    console.log("%c Line:40 🍌 file", "color:#b03734", file);
    let saveDir = this.toolsService.uploadFile(file);
    console.log("%c Line:42 🍋 saveDir", "color:#2eafb0", saveDir);
    await this.focusService.add(Object.assign(body, {
      focus_img: saveDir.saveDir
    }))
    res.send({
      status: 200,

    })
    // this.toolsService.success(res, `/${Config.adminPath}/focus`);

  }

  @Get('edit')
  @Render('admin/focus/edit')
  async edit(@Query() query) {
    try {
      let result = await this.focusService.findOne(query.id);

      return {
        focus: result
      };
    } catch (error) {
      console.log(error)
    }

  }

  @Post('doEdit')
  @UseInterceptors(FileInterceptor('focus_img'))
  async doEdit(@Body() body, @UploadedFile() file, @Response() res) {
    console.log("%c Line:72 🍞 file", "color:#33a5ff", file);


    let _id = body._id;

    if (file) {
      let saveDir = this.toolsService.uploadFile(file);
      await this.focusService.update({
        "_id": _id,
        ...body,
        focus_img: saveDir.saveDir
      });
    } else {
      await this.focusService.update({
        "_id": _id,
        ...body
      });
    }
    res.send({
      status: 200,

    })
    // this.toolsService.success(res, `/${Config.adminPath}/focus`);

  }

  @Post('delete')
  async delete(@Body() body, @Response() res) {
    var result = await this.focusService.delete(body.id);
    res.send({
      status: 200,
    })
    // this.toolsService.success(res, `/${Config.adminPath}/focus`);
  }
}
