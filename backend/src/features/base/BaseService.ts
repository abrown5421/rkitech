import { Document, Model } from 'mongoose';

export class BaseService<T extends Document> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async getById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data)
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec()
    }
}