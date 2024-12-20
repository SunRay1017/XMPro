import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsCate } from '../../schema/goods_cate.entity';
@Injectable()
export class GoodsCateService {


  constructor(@InjectRepository(GoodsCate)
  private readonly goodsCateRepository: Repository<GoodsCate>) { }

  async find() {
    try {
      return await this.goodsCateRepository.find();
    } catch (error) {
      return [];
    }
  }
  async findByPid(id) {
    try {
      return await this.goodsCateRepository.find({where:{pid:id}});
    } catch (error) {
      return [];
    }
  }
  async findOne(_id) {
    try {
      return await this.goodsCateRepository.findOne({ where: { _id } });
    } catch (error) {
      return {};
    }
  }


  async add(json) {
    console.log("%c Line:36 🍫 json", "color:#4fff4B", json);
    try {
      var admin = await this.goodsCateRepository.save(json);
      return admin;
    } catch (error) {
      return null;
    }
  }

  async update(json) {
   
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.goodsCateRepository.findOne({ where: { _id: json._id } })
      console.log("%c Line:50 🍌 oldData", "color:#33a5ff", oldData);
      console.log("%c Line:46 🍷 json", "color:#7f2b82", json);
      await this.goodsCateRepository.update(oldData, json);
      return { code: "success", msg: '更新成功', data: json };
    } catch (error) {
      return { code: "fail", msg: '更新失败', data: {} };
    }
  }

  async delete(_id: string) {
    try {
      await this.goodsCateRepository.delete({ _id });
      return { code: "success", msg: '删除成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
