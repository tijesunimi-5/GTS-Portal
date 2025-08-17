// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import User from '@/model/User';
// import bcrypt from 'bcryptjs';

// export async function POST(request: Request) {
//   try {
//     await connectDB();

//     const { uniqueID, password } = await request.json();

//     if (!uniqueID || !password) {
//       return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
//     }

//     const user = await User.findOne({ uniqueID }).select('+password');

//     if (!user) {
//       return NextResponse.json({ message: 'Student record not found' }, { status: 404 });
//     }

//     if (user.password) {
//       return NextResponse.json({ message: 'User already registered' }, { status: 400 });
//     }

//     user.password = await bcrypt.hash(password, 10);
//     await user.save();

//     return NextResponse.json({
//       message: 'Signup successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         uniqueID: user.uniqueID,
//         department: user.department,
//         role: user.role,
//       },
//       token: 'dummy-token', // You can replace this with real JWT generation
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/model/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { uniqueID, password } = await request.json();

    if (!uniqueID || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const sanitizedUniqueID = uniqueID.trim().toUpperCase();

    const user = await User.findOne({ uniqueID: sanitizedUniqueID }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Student record not found' }, { status: 404 });
    }

    if (user.password) {
      return NextResponse.json({ message: 'User already registered' }, { status: 400 });
    }

    // This is the "your way" change: the password is NOT hashed.
    user.password = password;
    await user.save();

    return NextResponse.json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        uniqueID: user.uniqueID,
        department: user.department,
        role: user.role,
      },
      token: 'dummy-token',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}