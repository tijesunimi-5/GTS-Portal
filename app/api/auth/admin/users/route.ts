import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    // Verify admin access
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string; role: string };
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { name, uniqueID, password, department, role } = await request.json();

    if (!name || !uniqueID || !password || !department || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Validate uniqueID format
    if (!/^[A-Z0-9]{10}$/.test(uniqueID)) {
      return NextResponse.json({ message: 'Unique ID must be 10 characters (e.g., 21900631BJ)' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ uniqueID });
    if (existingUser) {
      return NextResponse.json({ message: 'Account already exists' }, { status: 409 });
    }

    // Create new user
    const user = new User({
      name,
      uniqueID,
      password, // Will be hashed by the pre-save hook
      department,
      role: role === 'admin' ? 'admin' : 'student',
    });

    await user.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}