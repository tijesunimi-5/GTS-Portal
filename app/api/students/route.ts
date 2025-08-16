import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserModel, { IUser } from '@/model/User';

// GET all users
export async function GET() {
  await connectDB();
  try {
    const users: IUser[] = await UserModel.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users', error }, { status: 500 });
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