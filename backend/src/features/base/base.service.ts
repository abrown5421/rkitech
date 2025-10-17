import { Document, Model } from 'mongoose';

export class BaseService<T extends Document> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async read(filters: Partial<Record<keyof T, any>> = {}): Promise<T[]> {
        const query: any = {};
        for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== '') {
            query[key] = value;
        }
        }

        return this.model.find(query).exec();
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