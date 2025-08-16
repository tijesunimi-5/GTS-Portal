import { NextResponse, NextRequest } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import LinkModel, { ILink } from '@/model/Link';

// POST a new link
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const newLink: ILink = await LinkModel.create(body);
    return NextResponse.json({ message: 'Link created successfully!', link: newLink }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create link', error }, { status: 500 });
  }
}