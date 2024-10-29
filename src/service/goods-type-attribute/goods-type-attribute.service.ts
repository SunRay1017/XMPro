import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsTypeAttribute } from '../../schema/goods_type_attribute.entity';

@Injectable()
export class GoodsTypeAttributeService {

  constructor(@InjectRepository(GoodsTypeAttribute)
  private readonly goodsTypeAttributeRepository: Repository<GoodsTypeAttribute>) { }

  async find() {
    try {
      return await this.goodsTypeAttributeRepository.find();
    } catch (error) {
      return [];
    }
  }
  async findOne(_id) {
    try {
      return await this.goodsTypeAttributeRepository.findOne({ where: { _id } });
    } catch (error) {
      return {};
    }
  }


  async add(json) {
    try {
      var admin = await this.goodsTypeAttributeRepository.save(json);
      return admin;
    } catch (error) {
      return null;
    }
  }

  async update(json) {
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.goodsTypeAttributeRepository.findOne({ where: { _id: json._id } })
      await this.goodsTypeAttributeRepository.update(oldData, json);
      return { code: "success", msg: '更新成功', data: json };
    } catch (error) {
      return { code: "fail", msg: '更新失败', data: {} };
    }
  }

  async delete(_id: string) {
    try {
      await this.goodsTypeAttributeRepository.delete({ _id });
      return { code: "success", msg: '删除成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
