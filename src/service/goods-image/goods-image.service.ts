import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsImg } from '../../schema/goods_image.entity';
@Injectable()
export class GoodsImageService {
  constructor(@InjectRepository(GoodsImg)
  private readonly goodsImageRepository: Repository<GoodsImg>) { }
  async findAll() {
    try {
      return await this.goodsImageRepository.find();
    } catch (error) {
      return [];
    }
  }
  async find(id) {
    try {
      return await this.goodsImageRepository.find({ where: { goods_id: id } });
    } catch (error) {
      return [];
    }
  }
  async add(json) {
    try {
      await this.goodsImageRepository.save(json);

    } catch (error) {
      return null;
    }
  }

  async deleteMany(json) {
    try {
      var result = await this.goodsImageRepository.delete(json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
