import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/model/User';

// Helper to get ID from request URL
function getId(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  return segments[segments.length - 1];
}

// PUT (Update) a student
export async function PUT(req: NextRequest) {
  const id = getId(req);
  await connectDB();

  try {
    const body = await req.json();
    const updatedUser: IUser | null = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully!', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update student', error }, { status: 500 });
  }
}

// DELETE a student
export async function DELETE(req: NextRequest) {
  const id = getId(req);
  await connectDB();

  try {
    const deletedUser: IUser | null = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete student', error }, { status: 500 });
  }
}
