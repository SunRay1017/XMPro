import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Focus } from '../../schema/focus.entity';
import { Config } from 'src/config/config';

@Injectable()
export class FocusService {
  constructor(
    @InjectRepository(Focus)
    private readonly focusRepository: Repository<Focus>
  ) { }

  async findOne(_id){
    try {
        return await this.focusRepository.findOne({where:{_id}});
    } catch (error) {
        return {};
    }       
}
  async find(){
    try {
        return await this.focusRepository.find();
    } catch (error) {
        return [];
    }       
}
  async add(json) {
    try {
      var result = await this.focusRepository.save(json);
      return result;
    } catch (error) {
      return null;
    }
  }

  async update(foucs) {
    try {
      // 先根据admin_id找出数据库的这条数据
      var oldData = await this.focusRepository.findOne({ where: { _id: foucs._id } })
      await this.focusRepository.update(oldData, foucs);
      return { code: "success", msg: '更新成功', data: foucs };
    } catch (error) {
      return { code: "fail", msg: '更新失败', data: {} };
    }
  }

  async delete(_id: string) {
    try {
      await this.focusRepository.delete({ _id });
      return { code: "success", msg: '删除成功', data: {} };
    } catch (error) {
      return { code: "fail", msg: '删除失败', data: {} };
    }
  }
}
