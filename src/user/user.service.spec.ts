import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './schema/user.schema';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        MailerService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue({ save: jest.fn() }), // Mock the User model methods
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: 'MailerService',
          useValue: {
            sendMail: jest.fn().mockResolvedValue({}), // Mock the MailerService sendMail method
          },
        },
        {
          provide: 'ClientProxyFactory',
          useValue: {
            create: jest.fn().mockReturnValue({
              emit: jest.fn().mockResolvedValue({}), // Mock the ClientProxy emit method
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      const result = await service.create(createUserDto);

      expect(result).toBe('User created successfully!');
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const userId = '1';

      // Mocking axios.get
      jest
        .spyOn(service as any, 'findOne')
        .mockResolvedValueOnce({ data: { id: userId } });

      const result = await service.findOne(userId);

      expect(result).toEqual({ id: userId });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const userId = '1';

      const result = await service.delete(userId);

      expect(result).toBe('User deleted successfully!');
    });
  });
});
