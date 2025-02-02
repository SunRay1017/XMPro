import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from 'src/schema/setting.entity';
@Injectable()
export class SettingService {
  constructor(@InjectRepository(Setting) private readonly SettingRepository: Repository<Setting>) { }

  async find() {
    try {
      const result = await this.SettingRepository.find();
      return result
    } catch (error) {
      return [];
    }
  }

  async add(json) {
    try {
      var result = await this.SettingRepository.save(json);
      return result;
    } catch (error) {
      return null;
    }
  }
  async update(json) {
    try {
      var oldData = await this.SettingRepository.findOne({ where: { _id: json._id } })
      var result = await this.SettingRepository.update(oldData, json);
      return result;
    } catch (error) {
      return null;
    }
  }
}
