// avatar/avatar.controller.ts
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('api/user/:userId/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get()
  async getAvatar(@Param('userId') userId: string): Promise<string> {
    return this.avatarService.getAvatar(userId);
  }

  @Delete()
  async deleteAvatar(@Param('userId') userId: string): Promise<string> {
    return this.avatarService.deleteAvatar(userId);
  }
}
