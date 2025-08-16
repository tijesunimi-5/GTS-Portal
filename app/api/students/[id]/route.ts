import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StudentModel, { IStudent } from '@/model/Student';

// PUT (Update) a student by ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } } // <-- inline typing
) {
  const { params } = context;
  const { id } = params;

  await connectDB();
  try {
    const body = await req.json();
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully!', student: updatedStudent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update student', error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = params;

  await connectDB();
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete student', error }, { status: 500 });
  }
}

