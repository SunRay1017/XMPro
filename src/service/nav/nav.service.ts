import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Nav } from 'src/schema/nav.entity';
@Injectable()
export class NavService {
  constructor(@InjectRepository(Nav)
  private readonly NavRepository: Repository<Nav>) { }

  async find(json) {
    const { currentPage, pageSize, title } = json
    try {
      const [list, total] = await this.NavRepository.findAndCount({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,

      });
      return { list, total };
    } catch (error) {
      return [];
    }
  }
  async findOne(_id) {

    try {
      return await this.NavRepository.findOne({ where: { _id } });
    } catch (error) {
      return {};
    }
  
  }
  async add(json) {
    try {
      return await this.NavRepository.save(json);

    } catch (error) {
      return [];
    }
  }
  async update(json) {
    try {
      // 先根据_id找出数据库的这条数据
      var oldData = await this.NavRepository.findOne({ where: { _id: json._id } })

      await this.NavRepository.update(oldData, json);
      return { code: "success", msg: '更新导航成功', data: json };
    } catch (error) {
      return { code: "fail", msg: '更新导航失败', data: {} };
    }
  }
  async delete(_id) {
    try {

      await this.NavRepository.delete({_id});
      return { code: "success", msg: '删除成功'};
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
