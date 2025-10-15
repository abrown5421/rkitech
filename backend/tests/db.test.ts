import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

describe('MongoDB Connection', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!)
    })

    afterAll(async () => {
        await mongoose.connection.close();
    })

    test('Should connect to MongoDB successfully', () => {
        expect(mongoose.connection.readyState).toBe(1);
    })
})