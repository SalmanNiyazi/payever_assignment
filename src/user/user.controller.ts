// users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not Found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not Found');
    }
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    try {
      await this.usersService.delete(userId);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
