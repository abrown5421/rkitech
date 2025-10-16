import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Employee } from './employee.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const defaultEmployees = [
  {
    employeeFirstName: 'Rkitech',
    employeeLastName: 'Superemployee',
    employeeEmail: 'Rkitech.superemployee@rkitech.com',
    employeePassword: 'string',
    employeeCreated: Date.now(),
    employeeProfileImage: '',
    employeeRole: 'Admin',
    employeeTitle: 'Developer',
    employeeBio: ''
  }
];

const seedEmployees = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const employeeData of defaultEmployees) {
      const exists = await Employee.findOne({ employeeEmail: employeeData.employeeEmail });
      if (!exists) {
        await Employee.create(employeeData);
        console.log(`Inserted employee: ${employeeData.employeeFirstName}`);
      }
    }

    console.log('✅ Default employees initialized');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding employees:', err);
  }
};

seedEmployees();
