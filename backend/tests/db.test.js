"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe('MongoDB Connection', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(process.env.MONGO_URI_TEST);
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    test('Should connect to MongoDB successfully', () => {
        expect(mongoose_1.default.connection.readyState).toBe(1);
    });
});
