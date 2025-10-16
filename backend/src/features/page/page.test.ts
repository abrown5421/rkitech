import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from '../../app';

dotenv.config();

describe('Pages API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection?.db?.dropDatabase();
    await mongoose.connection.close();
  });

  let createdPageId: string;
  
  test('GET /api/pages should return all pages', async () => {
    const res = await request(app).get('/api/pages');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/pages should create a new page', async () => {
    const newPage = {
      pageName: 'Test Page',
      pagePath: '/test-page',
      pageRenderMethod: 'static',
      pageActive: true,
      pageColor: 'white',
      pageIntensity: false,
      pageEntranceAnimation: 'animate__fadeIn',
      pageExitAnimation: 'animate__fadeOut',
    };

    const res = await request(app).post('/api/pages').send(newPage);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pageName).toBe('Test Page');

    createdPageId = res.body.data._id; 
  });

  test('GET /api/pages/?_id should return a single page', async () => {
    const res = await request(app).get(`/api/pages?_id=${createdPageId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(createdPageId);
  });

  test('PUT /api/pages/:id should update a page', async () => {
    const res = await request(app)
      .put(`/api/pages/${createdPageId}`)
      .send({ pageName: 'Updated Page Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.pageName).toBe('Updated Page Name');
  });

  test('DELETE /api/pages/:id should delete a page', async () => {
    const res = await request(app).delete(`/api/pages/${createdPageId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(true);
  });
});
