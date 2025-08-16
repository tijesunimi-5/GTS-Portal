import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserModel, { IUser } from '@/model/User';

// PUT (Update) a user by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User updated successfully!', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user', error }, { status: 500 });
  }
}

// DELETE a user by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    const deletedUser: IUser | null = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error }, { status: 500 });
  }
}