import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsAttr } from '../../schema/goods_attr.entity';
@Injectable()
export class GoodsAttrService {
  constructor(@InjectRepository(GoodsAttr)
  private readonly goodsAttrRepository: Repository<GoodsAttr>) { }

  async find(id) {
    try {
      return await this.goodsAttrRepository.find({ where: { goods_id: id } });

    } catch (error) {
      return null;
    }
  }
  async add(json) {
    try {
      await this.goodsAttrRepository.save(json);

    } catch (error) {
      return null;
    }
  }

  async deleteMany(json) {
    try {
      var result = await this.goodsAttrRepository.delete(json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
