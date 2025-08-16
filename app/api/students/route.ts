import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudentModel, { IStudent } from '@/model/Student';

// GET all students
export async function GET() {
  await connectDB();
  try {
    const students: IStudent[] = await StudentModel.find({});
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch students', error }, { status: 500 });
  }
}

// POST a new student
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const newStudent: IStudent = await StudentModel.create(body);
    return NextResponse.json({ message: 'Student added successfully!', user: newStudent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add student', error }, { status: 500 });
  }
}