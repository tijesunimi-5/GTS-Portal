// route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserModel from '@/model/User';
import User, {IUser} from '@/model/User';

/**
 * Handles GET requests to fetch all users.
 * @returns A NextResponse object with the list of users.
 */
export async function GET() {
  try {
    await connectDB();
    
    // Explicitly tell TS that users is an array of IUser
    const users: IUser[] = await UserModel.find({});

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),   // now TS knows _id is ObjectId
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


export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, uniqueID, department, role } = await req.json();

    if (!name || !uniqueID || !department) {
      return NextResponse.json(
        { message: 'Name, UniqueID and Department are required' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existing = await User.findOne({ uniqueID });
    if (existing) {
      return NextResponse.json(
        { message: 'Student with this UniqueID already exists' },
        { status: 400 }
      );
    }

    // Create student with pending status, no password
    const newUser = new UserModel({
      name,
      uniqueID: uniqueID.trim().toUpperCase(),
      department,
      role: 'student',
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'Student added successfully!', user: { id: newUser._id, name, uniqueID, role } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to add student:', error);
    return NextResponse.json(
      { message: 'Failed to add student', error: error.message },
      { status: 500 }
    );
  }
}
