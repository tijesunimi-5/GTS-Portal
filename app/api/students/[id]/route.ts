import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudentModel, { IStudent } from '@/model/Student';

// PUT (Update) a student by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedStudent: IStudent | null = await StudentModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Student updated successfully!', student: updatedStudent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update student', error }, { status: 500 });
  }
}

// DELETE a student by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    const deletedStudent: IStudent | null = await StudentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Student deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete student', error }, { status: 500 });
  }
}