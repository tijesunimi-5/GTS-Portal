import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    await connectDB();
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string; uniqueID: string; role: string };

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        uniqueID: user.uniqueID,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}