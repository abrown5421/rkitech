import request from 'supertest';
import mongoose, { Document } from 'mongoose';
import dotenv from 'dotenv';
import { app } from '../../app';

dotenv.config();

export type PlainObject<T extends Document> = Omit<T, keyof Document>;

export interface CrudTestConfig<T extends Document> {
  resourceName: string;
  endpoint: string;
  createPayload: PlainObject<T>;
  updatePayload: Partial<PlainObject<T>>;
  createExpectations: {
    field: keyof PlainObject<T>;
    value: any;
  }[];
  updateExpectations: {
    field: keyof PlainObject<T>;
    value: any;
  };
}

export class BaseCrudTest<T extends Document> {
  protected config: CrudTestConfig<T>;
  protected createdResourceId: string = '';

  constructor(config: CrudTestConfig<T>) {
    this.config = config;
  }

  setupDatabase() {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URI_TEST!);

      const db = mongoose.connection.db;
      if (!db) throw new Error('MongoDB connection not established.');

      const collectionName = this.config.endpoint.replace('/api/', '');
      await db.collection(collectionName).deleteMany({});
    });

    afterAll(async () => {
      await mongoose.connection.close();
    });
  }

  testGetAll() {
    test(`GET ${this.config.endpoint} should return all ${this.config.resourceName}`, async () => {
      const res = await request(app).get(this.config.endpoint);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  }

  testCreate() {
    test(`POST ${this.config.endpoint} should create a new ${this.config.resourceName}`, async () => {
      const res = await request(app)
        .post(this.config.endpoint)
        .send(this.config.createPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

      this.config.createExpectations.forEach(({ field, value }) => {
        if (typeof value === 'object' && value !== null) {
          expect(res.body.data[field as string]).toMatchObject(value);
        } else {
          expect(res.body.data[field as string]).toBe(value);
        }
      });

      this.createdResourceId = res.body.data._id;
    });
  }

  testGetById() {
    test(`GET ${this.config.endpoint}/?_id should return a single ${this.config.resourceName}`, async () => {
      const res = await request(app).get(
        `${this.config.endpoint}?_id=${this.createdResourceId}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]._id).toBe(this.createdResourceId);
    });
  }

  testUpdate() {
    test(`PUT ${this.config.endpoint}/:id should update a ${this.config.resourceName}`, async () => {
      const res = await request(app)
        .put(`${this.config.endpoint}/${this.createdResourceId}`)
        .send(this.config.updatePayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const { field, value } = this.config.updateExpectations;

      if (typeof value === 'object' && value !== null) {
        expect(res.body.data[field as string]).toMatchObject(value);
      } else {
        expect(res.body.data[field as string]).toBe(value);
      }
    });
  }

  testDelete() {
    test(`DELETE ${this.config.endpoint}/:id should delete a ${this.config.resourceName}`, async () => {
      const res = await request(app).delete(
        `${this.config.endpoint}/${this.createdResourceId}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeUndefined();
    });
  }

  runAllTests() {
    this.setupDatabase();
    this.testGetAll();
    this.testCreate();
    this.testGetById();
    this.testUpdate();
    this.testDelete();
  }
}
