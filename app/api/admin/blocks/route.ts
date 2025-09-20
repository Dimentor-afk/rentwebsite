import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

const ADMIN_KEY = process.env.ADMIN_API_KEY;

export async function GET() {
  const blocks = await prisma.block.findMany({ orderBy: { startDate: 'asc' } });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key');
    if (!ADMIN_KEY || key !== ADMIN_KEY) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const body = await req.json();
    const { startDate, endDate, reason } = body;
    const b = await prisma.block.create({ data: { startDate: new Date(startDate), endDate: new Date(endDate), reason } });
    return NextResponse.json(b);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key');
    if (!ADMIN_KEY || key !== ADMIN_KEY) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.block.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
