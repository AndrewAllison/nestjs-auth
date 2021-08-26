import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import dotenv from 'dotenv';
import request from 'supertest';
// Needs calling before the  AppModule
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'local'}`,
});

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
