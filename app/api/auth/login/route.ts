import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/model/User';
import { IUser } from '@/model/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uniqueID, email, password } = await request.json();

    if (!password || (!uniqueID && !email)) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    let user;
    if (email) {
      user = await User.findOne({ email }).select('+password') as IUser;
    } else {
      user = await User.findOne({ uniqueID }).select('+password') as IUser;
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        uniqueID: user.uniqueID,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
