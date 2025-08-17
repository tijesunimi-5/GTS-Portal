import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import LinkModel, { ILink } from '@/model/Link';

// PUT (Update) a link by ID
export async function PUT(req: NextRequest, params: any) {
  await connectDB();
  const { id } = params.params; // Access id from params.params
  try {
    const body = await req.json();
    const updatedLink: ILink | null = await LinkModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedLink) {
      return NextResponse.json({ message: 'Link not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Link updated successfully!', link: updatedLink }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update link', error }, { status: 500 });
  }
}

// DELETE a link by ID
export async function DELETE(req: NextRequest, params: any) {
  await connectDB();
  const { id } = params.params; // Access id from params.params
  try {
    const deletedLink: ILink | null = await LinkModel.findByIdAndDelete(id);
    if (!deletedLink) {
      return NextResponse.json({ message: 'Link not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Link deleted successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete link', error }, { status: 500 });
  }
}