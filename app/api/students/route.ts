import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserModel, { IUser } from '@/model/User';
import User from '@/model/User';

/**
 * Handles GET requests to fetch all users.
 * @returns A NextResponse object with the list of users.
 */
export async function GET() {
  try {
    // Connect to the database
    await connectDB();
    
    // Find all users in the database
    const users = await User.find({});

    // Explicitly map the users to ensure the 'id' field is present and correctly formatted.
    // We cast each document to IUser to provide type safety and resolve the error.
    const formattedUsers = users.map((user: IUser) => ({
      id: user._id.toString(),
      name: user.name,
      uniqueID: user.uniqueID,
      department: user.department,
      role: user.role,
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
    const newUser: IUser = await UserModel.create(body);
    return NextResponse.json({ message: 'User added successfully!', user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add user', error }, { status: 500 });
  }
}