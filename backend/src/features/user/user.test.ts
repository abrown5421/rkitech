import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from '../../app';

dotenv.config();

describe('Users API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection?.db?.dropDatabase();
    await mongoose.connection.close();
  });

  let createdUserId: string;
  
  test('GET /api/users should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = {
        userFirstName: 'Test',
        userLastName: 'User',
        userEmail: 'test123@gmail.com',
        userPassword: 'hashedPassHere',
        userCreated: Date.now(),
        userProfileImage: '',
    };

    const res = await request(app).post('/api/users').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userFirstName).toBe('Test');
    expect(res.body.data.userLastName).toBe('User');

    createdUserId = res.body.data._id; 
  });

  test('GET /api/users/?_id should return a single user', async () => {
    const res = await request(app).get(`/api/users?_id=${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(createdUserId);
  });

  test('PUT /api/users/:id should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ userFirstName: 'Testing' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.userFirstName).toBe("Testing");
  });

  test('DELETE /api/users/:id should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(true);
  });
});
