import { NextRequest, NextResponse } from 'next/server';
import User from '@/model/User';
import { connectDB } from '@/lib/mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }  // ✅ inline this EXACTLY
) {
  try {
    await connectDB();
    const { id } = params;
    const updatedUserData = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating user', error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }  // ✅ exact same fix here
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting user', error },
      { status: 500 }
    );
  }
}
