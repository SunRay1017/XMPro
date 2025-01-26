import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsType } from '../../schema/goods_type.entity';
@Injectable()
export class GoodsTypeService {


  constructor(@InjectRepository(GoodsType)
  private readonly goodsTypeRepository: Repository<GoodsType>) { }

  async find() {
    try {
      return await this.goodsTypeRepository.find();
    } catch (error) {
      return [];
    }
  }
  async findOne(_id) {
    try {
      return await this.goodsTypeRepository.findOne({ where: { _id } });
    } catch (error) {
      return {};
    }
  }


  async add(json) {
    try {
      var admin = await this.goodsTypeRepository.save(json);
      return admin;
    } catch (error) {
      return null;
    }
  }

  async update(json) {
    console.log("%c Line:38 🍪 json", "color:#fca650", json);
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.goodsTypeRepository.findOne({ where: { _id: json._id } })
      console.log("%c Line:42 🍬 oldData", "color:#3f7cff", oldData);
      await this.goodsTypeRepository.update(oldData, json);
      return { code: "success", msg: '更新成功', data: json };
    } catch (error) {
      return { code: "fail", msg: '更新失败', data: {} };
    }
  }

  async delete(_id: string) {
    try {
      await this.goodsTypeRepository.delete({ _id });
      return { code: "success", msg: '删除成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
