// app/api/links/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import LinkModel, { ILink } from '@/model/Link';

// GET all links
export async function GET() {
  await connectDB();
  try {
    const links: ILink[] = await LinkModel.find({});
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch links', error }, { status: 500 });
  }
}

// POST a new link
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const newLink: ILink = await LinkModel.create(body);
    return NextResponse.json({ message: 'Link added successfully!', link: newLink }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add link', error }, { status: 500 });
  }
}