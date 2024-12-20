import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from '../../schema/goods.entity';

@Injectable()
export class GoodsService {


  constructor(@InjectRepository(Goods)
  private readonly GoodsRepository: Repository<Goods>) { }

  async find() {
    try {
      return await this.GoodsRepository.find();
    } catch (error) {
      return [];
    }
  }

  async findOne(_id) {
    try {
      return await this.GoodsRepository.findOne({ where: { _id } });
    } catch (error) {
      return {};
    }
  }


  async add(json) {
    try {
      var admin = await this.GoodsRepository.save(json);
      return admin;
    } catch (error) {
      return null;
    }
  }

  async update(json) {
   
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.GoodsRepository.findOne({ where: { _id: json._id } })
    
      await this.GoodsRepository.update(oldData, json);
      return { code: "success", msg: '更新成功', data: json };
    } catch (error) {
      return { code: "fail", msg: '更新失败', data: {} };
    }
  }

  async delete(_id: string) {
    try {
      await this.GoodsRepository.delete({ _id });
      return { code: "success", msg: '删除成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
