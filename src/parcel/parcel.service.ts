import { Injectable } from '@nestjs/common';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { Parcel } from './entities/parcel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ParcelService {
  constructor(
    @InjectRepository(Parcel) private parcelRepository: Repository<Parcel>,
  ) {}
  async create(createParcelDto: CreateParcelDto) {
    const parcel = this.parcelRepository.create({
      ...createParcelDto,
      weight:
        typeof createParcelDto.weight === 'string'
          ? Number(createParcelDto.weight)
          : createParcelDto.weight,
      recipientId:
        createParcelDto.recipientId !== undefined
          ? String(createParcelDto.recipientId)
          : undefined,
      senderId:
        typeof createParcelDto.senderId === 'string'
          ? String(createParcelDto.senderId)
          : createParcelDto.senderId,
      courierId:
        createParcelDto.courierId !== undefined
          ? String(createParcelDto.courierId)
          : undefined,
    } as Partial<Parcel>);
    return this.parcelRepository.save(parcel);
  }

  async findAll() {
    return await this.parcelRepository.find();
  }

  async findOne(id: number) {
    const parcel = await this.parcelRepository.findOneBy({ id });
    if (!parcel) {
      return { found: false, message: 'Parcel not found' };
    }
    return parcel;
  }
  async update(id: number, updateParcelDto: UpdateParcelDto) {
    const parcel = await this.parcelRepository.findOneBy({ id });
    if (!parcel) {
      return { updated: false, message: 'Parcel not found' };
    }
    const updateData = {
      ...updateParcelDto,
      weight:
        typeof updateParcelDto.weight === 'string'
          ? Number(updateParcelDto.weight)
          : updateParcelDto.weight,
      recipientId:
        updateParcelDto.recipientId !== undefined
          ? Number(updateParcelDto.recipientId)
          : undefined,
      senderId:
        updateParcelDto.senderId !== undefined
          ? Number(updateParcelDto.senderId)
          : undefined,
      courierId:
        updateParcelDto.courierId !== undefined
          ? Number(updateParcelDto.courierId)
          : undefined,
    };
    await this.parcelRepository.update(id, updateData);
    return await this.parcelRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.parcelRepository.delete(id);
    return { deleted: true, message: 'Parcel deleted successfully' };
  }
}
