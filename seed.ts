import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from './model/User'; // adjust if nested in src/
import { Students } from './data/studentsData';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function seedStudents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const formattedStudents = Students.map((student) => ({
      ...student,
      password: null, // since it's registration-first
    }));

    // Optional: clean existing student entries
    await User.deleteMany({ role: 'student' });

    // Insert all students
    await User.insertMany(formattedStudents);

    console.log(`✅ Seeded ${formattedStudents.length} students to MongoDB.`);
  } catch (error) {
    console.error('❌ Error seeding students:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🚪 Disconnected from MongoDB');
  }
}

seedStudents();
