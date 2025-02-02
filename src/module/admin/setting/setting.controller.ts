import { Controller, Get, Post, Response, UseInterceptors, UploadedFiles, Body } from '@nestjs/common';
import { SettingService } from 'src/service/setting/setting.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ToolsService } from 'src/service/tools/tools.service';
@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService, private toolsService: ToolsService) { }
  /**获取网站设置数据 */
  @Get("getConfig")
  async getConfig(@Response() res) {
    var result = await this.settingService.find();
    res.send({ status: 200, data: result })
  }
  /**新增网站设置数据 */
  @Get("doAdd")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'site_logo', maxCount: 1 },
    { name: 'no_picture', maxCount: 1 },
  ]))
  async doAdd(@UploadedFiles() files, @Body() body, @Response() res) {
    var addJson = body;
    if (files.site_logo) {
      var siteLogoDir = this.toolsService.uploadFile(files.site_logo[0]).saveDir;

      addJson = Object.assign(addJson, {
        site_logo: siteLogoDir
      })
    }
    if (files.no_picture) {
      var noPictureDir = this.toolsService.uploadFile(files.no_picture[0]).saveDir;
      addJson = Object.assign(addJson, {
        no_picture: noPictureDir
      })
    }
    //更新数据
    await this.settingService.add(addJson);
    res.send({ status: 200 })
  }
  @Post('doEdit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'site_logo', maxCount: 1 },
    { name: 'no_picture', maxCount: 1 },
  ]))
  async doEdit(@UploadedFiles() files, @Body() body, @Response() res) {

    var updateJson = body;
    if (files.site_logo) {
      var siteLogoDir = this.toolsService.uploadFile(files.site_logo[0]).saveDir;

      updateJson = Object.assign(updateJson, {
        site_logo: siteLogoDir
      })
    }
    if (files.no_picture) {
      var noPictureDir = this.toolsService.uploadFile(files.no_picture[0]).saveDir;
      updateJson = Object.assign(updateJson, {
        no_picture: noPictureDir
      })
    }
    //更新数据
    await this.settingService.update(updateJson);
    res.send({ status: 200 })
  }

}
