import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const profile = this.profileRepository.create(createProfileDto);
    return await this.profileRepository.save(profile);
  }

  async findAll() {
    return await this.profileRepository.find();
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      return { found: false, message: 'Profile not found' };
    }
    return profile;
  }
  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      return { updated: false, message: 'Profile not found' };
    }
    await this.profileRepository.update(id, updateProfileDto);
    return this.profileRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      return { deleted: false, message: 'Profile not found' };
    }
    await this.profileRepository.delete(id);
    return { deleted: true, message: 'Profile deleted successfully' };
  }
}
