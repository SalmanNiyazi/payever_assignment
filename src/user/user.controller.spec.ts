import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'john',
        last_name: 'snow',
        email: 'snowjohn@yopmail.com',
      };

      await usersController.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException if user creation fails', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'john',
        last_name: 'snow',
        email: 'snowjohn@yopmail.com',
      };

      (userService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = '4';
      const userData = {
        /* Provide user data */
      };

      (userService.findOne as jest.Mock).mockResolvedValueOnce(userData);

      const result = await usersController.findOne(userId);

      expect(result).toEqual(userData);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '4';

      (userService.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(usersController.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const userId = '4';

      await usersController.remove(userId);

      expect(userService.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user deletion fails', async () => {
      const userId = '4';

      (userService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(usersController.remove(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
