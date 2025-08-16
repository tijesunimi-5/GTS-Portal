import { NextResponse } from 'next/server';
import { connectDB} from '@/lib/mongodb';
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