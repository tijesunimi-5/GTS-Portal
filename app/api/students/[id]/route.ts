// app/api/students/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import User from '@/model/User';
import {connectDB} from '@/lib/mongodb';

/**
 * Handles PUT requests to update a user.
 * @param req The incoming Next.js request.
 * @param { params: { id: string } } The dynamic route parameters, containing the user's ID.
 * @returns A NextResponse object.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectDB();
    
    // Destructure the user ID from the params
    const { id } = params;
    const updatedUserData = await req.json();

    // Find the user by ID and update them using findByIdAndUpdate
    // `new: true` returns the updated document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedUserData,
      { new: true }
    );

    // If user is not found, return a 404 Not Found response.
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`User with ID ${id} updated successfully.`);
    return NextResponse.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user', error },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to delete a user.
 * @param req The incoming Next.js request.
 * @param { params: { id: string } } The dynamic route parameters, containing the user's ID.
 * @returns A NextResponse object.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await connectDB();
    
    // Destructure the user ID from the params
    const { id } = params;

    // Find the user by ID and delete them using findByIdAndDelete
    const deletedUser = await User.findByIdAndDelete(id);

    // If the user is not found, return a 404 Not Found response.
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`User with ID ${id} deleted successfully.`);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user', error },
      { status: 500 }
    );
  }
}
