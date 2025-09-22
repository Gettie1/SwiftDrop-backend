import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { Mailer } from 'src/mails/mailHelper';
import { MailService } from 'src/mails/mails.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(data, salt);
  }

  private excludePassword(user: User): Partial<User> {
    const { password, hashedRefreshToken, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    // ✅ Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: ['id'],
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    // ✅ Hash password before saving
    const hashedPassword = await this.hashData(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ? createUserDto.role : undefined,
    });
    const savedUser = await this.userRepository.save(user);
    const mailer = Mailer(this.mailService);
    await mailer.welcomeMail({
      email: savedUser.email,
      name: savedUser.username,
    });
    return this.excludePassword(savedUser);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.excludePassword(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // ✅ Hash new password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return this.excludePassword(updatedUser);
  }

  async remove(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    return `User with id ${id} has been removed`;
  }
}
