import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
// import {
//   ClientProxy,
//   ClientProxyFactory,
//   Transport,
// } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    createUser.save();

    await this.mailerService.sendMail({
      to: createUserDto.email,
      subject: 'Payever Assignment!',
      html: '<p>Test email for payever assignment</p>',
    });

    // await this.rabbitmqService.emit('user_created', createUserDto);

    return 'User created successfully!';
  }

  async findOne(userId: string) {
    const url = `https://reqres.in/api/users/${userId}`;
    const response = await axios.get(url);
    return response.data;
  }

  async delete(userId: string) {
    this.userModel.findByIdAndDelete(userId);
    return 'User deleted successfully!';
  }
}
