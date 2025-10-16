import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './user.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const defaultUsers = [
  {
    userFirstName: 'Rkitech',
    userLastName: 'Superuser',
    userEmail: 'Rkitech.superuser@rkitech.com',
    userPassword: 'string',
    userCreated: Date.now(),
    userProfileImage: '',
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const userData of defaultUsers) {
      const exists = await User.findOne({ userEmail: userData.userEmail });
      if (!exists) {
        await User.create(userData);
        console.log(`Inserted user: ${userData.userFirstName}`);
      }
    }

    console.log('✅ Default users initialized');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

seedUsers();
