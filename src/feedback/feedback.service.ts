import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackrepository: Repository<Feedback>,
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    // Ensure rating is a number
    const dto = {
      ...createFeedbackDto,
      rating:
        typeof createFeedbackDto.rating === 'string'
          ? Number(createFeedbackDto.rating)
          : createFeedbackDto.rating,
      senderId:
        typeof createFeedbackDto.senderId === 'string'
          ? Number(createFeedbackDto.senderId)
          : createFeedbackDto.senderId,
      courierId:
        typeof createFeedbackDto.courierId === 'string'
          ? Number(createFeedbackDto.courierId)
          : createFeedbackDto.courierId,
    };
    const feedback = this.feedbackrepository.create(dto);
    return this.feedbackrepository.save(feedback);
  }

  async findAll() {
    return this.feedbackrepository.find();
  }

  async findOne(id: number) {
    const feedback = await this.feedbackrepository.findOneBy({ id });
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.findOne(id);
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    Object.assign(feedback, updateFeedbackDto);
    return this.feedbackrepository.save(feedback);
  }

  async remove(id: number) {
    const feedback = await this.findOne(id);
    return this.feedbackrepository.remove(feedback);
  }
}
