// avatar/avatar.controller.ts
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('api/user/:userId/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get(':userId')
  async getAvatar(@Param('userId') userId: string): Promise<string> {
    try {
      const avatar = await this.avatarService.getAvatar(userId);
      if (!avatar) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
      }
      return avatar;
    } catch (error) {
      throw new HttpException(
        'Failed to get avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async deleteAvatar(@Param('userId') userId: string): Promise<string> {
    try {
      await this.avatarService.deleteAvatar(userId);
      return 'Avatar deleted successfully';
    } catch (error) {
      throw new HttpException(
        'Failed to delete avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
