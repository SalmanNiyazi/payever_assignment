import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpStatus } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST)', async () => {
    const userData = {
      first_name: 'Alex',
      last_name: 'Carrey',
      email: 'dummy@example.com',
      /* Provide dummy user data */
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(userData)
      .expect(HttpStatus.CREATED);

    expect(response.body).toBeDefined();
    expect(response.body.userId).toBeDefined();
  });

  it('/api/user/{userId} (GET)', async () => {
    const userId = 'dummyUserId'; // a valid userId for testing

    const response = await request(app.getHttpServer())
      .get(`/api/user/${userId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it('/api/user/{userId}/avatar (GET)', async () => {
    const userId = 'dummyUserId'; // a valid userId for testing

    const response = await request(app.getHttpServer())
      .get(`/api/user/${userId}/avatar`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.base64Image).toBeDefined();
  });

  it('/api/user/{userId}/avatar (DELETE)', async () => {
    const userId = 'dummyUserId'; // a valid userId for testing

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/user/${userId}/avatar`)
      .expect(HttpStatus.OK);

    expect(deleteResponse.body.message).toEqual(
      `Avatar for user ${userId} deleted.`,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
