// seed.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./model/User.js";
import { Students } from "./data/studentsData.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env file");
}

const formattedStudents = Students.map((s) => ({
  ...s,
  role: "student",
  password: null,
}));

const adminUsers = [
  {
    name: "Tijesunimi Idowu",
    email: "tijesunimiidowu16@gmail.com",
    password: "teelight", // will be hashed automatically
    role: "admin",
  },
  {
    name: 'Dr. Genius',
    email: "mahmudabdulquddus360@gmail.com",
    password: 'GENIUS2025',
    role: 'admin',
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Seed students
    await User.deleteMany({ role: "student" });
    await User.insertMany(formattedStudents);
    console.log(`✅ Inserted ${formattedStudents.length} students`);

    // Seed admin
    for (const admin of adminUsers) {
      const existing = await User.findOne({ email: admin.email });
      if (!existing) {
        const newAdmin = new User(admin);
        await newAdmin.save();
        console.log(`✅ Admin seeded: ${admin.email}`);
      } else {
        console.log(`ℹ️ Admin already exists: ${admin.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();
