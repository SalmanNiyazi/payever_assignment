// avatar/avatar.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Avatar, AvatarDocument } from './schemas/avatar.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<AvatarDocument>,
  ) {}

  async getAvatar(userId: string): Promise<string> {
    try {
      const avatar = await this.avatarModel.findOne({ userId }).exec();

      if (avatar) {
        return avatar.image;
      } else {
        const avatarUrl = `https://reqres.in/img/faces/${userId}-image.jpg`;
        const response = await axios.get(avatarUrl, {
          responseType: 'arraybuffer',
        });

        const imageBuffer = Buffer.from(response.data, 'binary');
        const base64Image = imageBuffer.toString('base64');

        const hash = crypto
          .createHash('sha1')
          .update(base64Image)
          .digest('hex');

        const newAvatar = new this.avatarModel({
          userId,
          hash,
          image: base64Image,
        });
        await newAvatar.save();

        return base64Image;
      }
    } catch (error) {
      throw new HttpException(
        'Failed to process avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAvatar(userId: string): Promise<string> {
    const avatar = await this.avatarModel.findOne({ userId }).exec();

    if (avatar) {
      const filePath = path.join(
        __dirname,
        '..',
        'avatars',
        `${avatar.userId}.jpg`,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await this.avatarModel.findByIdAndDelete(avatar._id).exec();

      return `Avatar for user ${userId} deleted successfully.`;
    } else {
      return `Avatar for user ${userId} not found.`;
    }
  }
}
