import { Controller, Post, Body, Response } from '@nestjs/common';
import { NavService } from "src/service/nav/nav.service"
import { Config } from '../../../config/config'
@Controller(`${Config.adminPath}/nav`)
export class NavController {
  constructor(private navService: NavService) { }

  /**获取全部导航列表 */
  @Post("list")
  async getList(@Body() body, @Response() res) {
    var result = await this.navService.find(body);
    res.send({ status: 200, data: result })
  }
  /**添加导航 */
  @Post("doAdd")
  async add(@Body() body, @Response() res) {
    var result = await this.navService.add(body);
    res.send({ status: 200 })
  }

  /**修改导航 */
  @Post("doEdit")
  async edit(@Body() body, @Response() res) {
    const result = await this.navService.update(body);
    if (result.code === "success") {
      res.send({ status: 200 })
    }

  }
  /**删除导航 */
  @Post("delete")
  async delete(@Body() body, @Response() res) {
    const result = await this.navService.delete(body._id);
    if (result.code === "success") {
      res.send({ status: 200 })
    }

  }
}
