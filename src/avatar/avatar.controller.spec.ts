import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { getModelToken } from '@nestjs/mongoose';

describe('AvatarController', () => {
  let controller: AvatarController;
  let avatarService: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        AvatarService,
        { provide: getModelToken('Avatar'), useValue: {} }, // Mock AvatarModel dependency
        { provide: getModelToken('Avatar'), useValue: {} }, // Mock AvatarSchema dependency
      ],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
    avatarService = module.get<AvatarService>(AvatarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return avatar image for a given userId', async () => {
      const userId = '2';
      const avatarImage = 'base64encodedimage';
      jest.spyOn(avatarService, 'getAvatar').mockResolvedValue(avatarImage);

      const result = await controller.getAvatar(userId);

      expect(result).toEqual(avatarImage);
      expect(avatarService.getAvatar).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar image for a given userId', async () => {
      const userId = '2';
      const deleteMessage = 'Avatar deleted successfully';
      jest
        .spyOn(avatarService, 'deleteAvatar')
        .mockResolvedValue(deleteMessage);

      const result = await controller.deleteAvatar(userId);

      expect(result).toEqual(deleteMessage);
      expect(avatarService.deleteAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
