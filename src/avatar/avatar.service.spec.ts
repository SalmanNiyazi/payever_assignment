import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import * as fs from 'fs';
import * as util from 'util';
import axios from 'axios';

jest.mock('axios');
jest.mock('fs');

describe('AvatarService', () => {
  let service: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarService],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get and save the avatar if it does not exist', async () => {
    // Mock findOne to return null (no existing avatar)
    const mockAvatarModel = { findOne: jest.fn().mockResolvedValue(null) };
    jest.doMock('./avatar.model', () => ({
      avatarModel: mockAvatarModel,
    }));

    // Mock userId
    const userId = '123';

    // Mock axios.get response
    (axios.get as jest.Mock).mockResolvedValue({
      data: Buffer.from('fake image data'),
    });

    // Mock writeFile function
    (util.promisify as unknown as jest.Mock).mockResolvedValue(undefined);

    // Mock avatarModel constructor
    const mockAvatarModelConstructor = jest.fn();
    jest.doMock('./avatar.model', () => ({
      avatarModel: mockAvatarModelConstructor,
    }));

    // Call the getAvatar function
    const base64Image = await service.getAvatar(userId);

    // Check that axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(
      `https://reqres.in/img/faces/${userId}-image.jpg`,
      {
        responseType: 'arraybuffer',
      },
    );

    // Check that writeFile was called with the correct arguments
    expect(util.promisify(fs.writeFile)).toHaveBeenCalledWith(
      `${userId}.jpg`,
      expect.any(Buffer),
    );

    // Check that a new avatar was created and saved
    expect(mockAvatarModel.findOne).toHaveBeenCalledWith({ userId });
    expect(mockAvatarModelConstructor).toHaveBeenCalledWith({
      userId,
      hash: expect.any(String),
      image: expect.any(String),
      fileName: `${userId}.jpg`,
    });
    expect(
      mockAvatarModelConstructor.mock.instances[0].save,
    ).toHaveBeenCalled();

    // Check that the base64-encoded image was returned
    expect(base64Image).toEqual(expect.any(String));
  });

  it('should return the existing avatar if it exists', async () => {
    // Mock existing avatar
    const existingAvatar = {
      userId: '123',
      image: 'base64encodedimage',
    };
    const mockAvatarModel = {
      findOne: jest.fn().mockResolvedValue(existingAvatar),
    };
    jest.doMock('./avatar.model', () => ({
      avatarModel: mockAvatarModel,
    }));

    // Mock userId
    const userId = '123';

    // Call the getAvatar function
    const base64Image = await service.getAvatar(userId);

    // Check that axios.get was not called
    expect(axios.get).not.toHaveBeenCalled();

    // Check that writeFile was not called
    expect(util.promisify(fs.writeFile)).not.toHaveBeenCalled();

    // Check that the base64-encoded image from the existing avatar was returned
    expect(base64Image).toEqual(existingAvatar.image);
  });
});
