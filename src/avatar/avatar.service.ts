// avatar/avatar.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Avatar, AvatarDocument } from './schemas/avatar.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<AvatarDocument>,
  ) {}

  async getAvatar(userId: string): Promise<string> {
    let existingAvatar = await this.avatarModel.findOne({ userId });

    if (!existingAvatar) {
      // If avatar does not exist in database, fetch and save the image
      const imageData = await this.fetchAndSaveImage(userId);
      const hash = crypto.createHash('sha256').update(imageData).digest('hex');

      // Save the avatar metadata to the database
      existingAvatar = await this.avatarModel.create({ userId, hash });
    }

    // Return base64 encoded image data
    return existingAvatar.image;
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

  private async fetchAndSaveImage(userId: string): Promise<Buffer> {
    const url = `https://reqres.in/img/faces/${userId}-image.jpg`;

    try {
      // Fetch avatar image data
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(response.data, 'binary');
      // Save avatar image to the filesystem
      const writeFileAsync = util.promisify(fs.writeFile);
      const fileName = `${userId}.jpg`;
      await writeFileAsync(fileName, imageData);
      return imageData;
    } catch (error) {
      console.error('Failed to fetch and save image:', error);
      throw new HttpException(
        'Failed to fetch and save image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
