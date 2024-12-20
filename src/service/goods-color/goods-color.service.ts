import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsColor } from '../../schema/goods_color.entity';
@Injectable()
export class GoodsColorService {

  constructor(@InjectRepository(GoodsColor) private readonly goodsColorRepository: Repository<GoodsColor>) {

  }

  async find() {
    try {
      return await this.goodsColorRepository.find();
    } catch (error) {
      return [];
    }
  }

}


