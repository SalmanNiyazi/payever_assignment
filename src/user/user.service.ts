import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class UserService {
  private readonly rabbitmqService: ClientProxy;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {
    this.rabbitmqService = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const createUser = new this.userModel(createUserDto);
      await createUser.save();

      await this.sendEmail(
        createUserDto.email,
        `${createUserDto.first_name} ${createUserDto.last_name}`,
      );
      await this.publishUserCreatedEvent(createUserDto);

      return 'User created successfully!';
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(userId: string) {
    try {
      const url = `${process.env.REQRES_URL}/${userId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new HttpException('Failed to find user', HttpStatus.NOT_FOUND);
    }
  }

  async delete(userId: string) {
    try {
      await this.userModel.findByIdAndDelete(userId);
      return 'User deleted successfully!';
    } catch (error) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async sendEmail(email: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Payever Assignment',
      html: `<p>Hello ${name},<br>This is a test email for payever assignment</p>`,
    });
  }

  private async publishUserCreatedEvent(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    await this.rabbitmqService.emit('user_created', createUserDto);
  }
}
