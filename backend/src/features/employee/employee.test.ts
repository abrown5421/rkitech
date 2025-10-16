import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from '../../app';

dotenv.config();

describe('Employees API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST!);
  });

  afterAll(async () => {
    await mongoose.connection?.db?.dropDatabase();
    await mongoose.connection.close();
  });

  let createdEmployeeId: string;
  
  test('GET /api/employees should return all employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/employees should create a new employee', async () => {
    const newEmployee = {
        employeeFirstName: 'Test',
        employeeLastName: 'Employee',
        employeeEmail: 'Test.Employee@rkitech.com',
        employeePassword: 'string',
        employeeCreated: Date.now(),
        employeeProfileImage: '',
        employeeRole: 'Test',
        employeeTitle: 'Test Title',
        employeeBio: ''
    };

    const res = await request(app).post('/api/employees').send(newEmployee);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employeeFirstName).toBe('Test');
    expect(res.body.data.employeeLastName).toBe('Employee');

    createdEmployeeId = res.body.data._id; 
  });

  test('GET /api/employees/?_id should return a single employee', async () => {
    const res = await request(app).get(`/api/employees?_id=${createdEmployeeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(createdEmployeeId);
  });

  test('PUT /api/employees/:id should update a employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${createdEmployeeId}`)
      .send({ employeeFirstName: 'Testing' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.employeeFirstName).toBe("Testing");
  });

  test('DELETE /api/employees/:id should delete a employee', async () => {
    const res = await request(app).delete(`/api/employees/${createdEmployeeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(true);
  });
});
