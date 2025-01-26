import { Injectable } from '@nestjs/common';
import { Repository,Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from '../../schema/goods.entity';

@Injectable()
export class GoodsService {


  constructor(@InjectRepository(Goods)
  private readonly GoodsRepository: Repository<Goods>) { }

  async find(json) {
    const { currentPage, pageSize, title } = json
    console.log("%c Line:15 🥪 title", "color:#3f7cff", title);
    try {
     
      // return await this.GoodsRepository.find();
      const [list, total] = await this.GoodsRepository.findAndCount({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        where: title ? {
          title:Like(`%${title}%`)
        } : null
      });
      return { list, total };
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
    console.log("%c Line:31 🍌 json", "color:#e41a6a", json);
    try {
      var admin = await this.GoodsRepository.save(json);
      console.log("%c Line:34 🌭 admin", "color:#ffdd4d", admin);
      return admin;
    } catch (error) {
      console.log("%c Line:37 🥚 error", "color:#3f7cff", error);
      return null;
    }
  }

  async update(json) {
    console.log("%c Line:43 🌶 json", "color:#b03734", json);

    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.GoodsRepository.findOne({ where: { _id: json._id } })

      await this.GoodsRepository.update(oldData, json);
      return { code: "success", msg: '更新成功', data: json };
    } catch (error) {
      console.log("%c Line:52 🍫 error", "color:#ffdd4d", error);
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
