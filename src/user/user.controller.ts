// users/users.controller.ts
import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return this.usersService.delete(userId);
  }
}
