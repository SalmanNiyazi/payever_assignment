import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_QUEUE,
        },
      },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILER_HOST'),
          port: configService.get<string>('MAILER_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAILER_EMAIL'),
            pass: configService.get<string>('MAILER_PASS'),
          },
          authMethod: configService.get<string>('MAILER_AUTH_METHOD'),
        },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UsersController],
})
export class UserModule {
  constructor(configService: ConfigService) {
    // Check if required environment variables for RabbitMQ are present
    const rabbitMQUrl = configService.get<string>('RABBITMQ_URL');
    const rabbitMQQueue = configService.get<string>('RABBITMQ_QUEUE');
    if (!rabbitMQUrl || !rabbitMQQueue) {
      throw new HttpException(
        'RabbitMQ configuration is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
