import { Injectable } from '@nestjs/common';
import * as svgCaptcha from "svg-captcha";
import * as md5 from "md5"
//格式化日期
import {
  format
} from 'silly-datetime';


import { join, extname } from 'path';

import { Config } from '../../config/config';

//创建目录
import * as mkdirp from 'mkdirp';

import { createWriteStream } from 'fs';
//注意引入方法
const sharp = require('sharp');
@Injectable()
export class ToolsService {
  getCaptcha() {
    var captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: "#fff",
      color: true
    });
    return captcha;
  }
  getMd5(str: string) {
    return md5(str)
  }
  async success(res, redirectUrl) {
    await res.render("admin/public/success", {
      redirectUrl: redirectUrl
    })
  }
  async error(res, redirectUrl, message) {
    await res.render("admin/public/error", {
      message: message,
      redirectUrl: redirectUrl
    })
  }
  getTime() {

    let d = new Date();
    return d.getTime();
  }
  uploadFile(file) {

    /*
      1、获取当前日期   20191013
      2、根据日期创建目录
      3、实现上传
      4、返回图片保存的地址
      
    */
    if (file) {

      // 1、获取当前日期   20191013
      let day = format(new Date(), 'YYYYMMDD');  //目录名称

      let d = this.getTime();  //时间戳  当前图片的名称


      // 2、根据日期创建目录

      let dir = join(__dirname, `../../../public/${Config.uploadDir}`, day);

      mkdirp.sync(dir);

      let uploadDir = join(dir, d + extname(file.originalname));

      // 3、实现上传

      const writeImage = createWriteStream(uploadDir);
      writeImage.write(file.buffer);

      // 4、返回图片保存的地址

      let saveDir = join(Config.uploadDir, day, d + extname(file.originalname));

      return {
        saveDir,
        uploadDir
      };

    } else {
      return {
        saveDir: '',
        uploadDir: ""
      };;
    }



  }
  async jimpImg(target) {

    try {
      await sharp(target)
        .resize(200, 200)
        .toFile(target + "_200x200" + extname(target));
      console.log('缩略图生成成功！');
    } catch (err) {
      console.error('生成缩略图时发生错误:', err);
    }

    try {
      await sharp(target)
        .resize(100, 100)
        .toFile(target + "_100x100" + extname(target));
      console.log('缩略图生成成功！');
    } catch (err) {
      console.error('生成缩略图时发生错误:', err);
    }

  }
}
