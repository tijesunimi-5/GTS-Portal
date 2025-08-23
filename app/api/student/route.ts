// route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/User';

/**
 * Handles GET requests to fetch all users.
 * @returns A NextResponse object with the list of users.
 */
export async function GET() {
  try {
    await connectDB();
    
    // Find all users in the database using the correct model
    const users = await UserModel.find({});

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      uniqueID: user.uniqueID,
      department: user.department,
      role: user.role,
      status: user.status,
    }));
    
    console.log('Users fetched successfully.');
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users', error },
      { status: 500 }
    );
  }
}

// POST a new user
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    // The password is not required in the model, so this will work.
    const newUser = await UserModel.create({ ...body, status: 'pending' });
    return NextResponse.json({ message: 'User added successfully!', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Failed to add user:', error);
    return NextResponse.json({ message: 'Failed to add user', error }, { status: 500 });
  }
}