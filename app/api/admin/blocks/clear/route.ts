import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

function isAuthorized(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.replace(/^Bearer\s+/, '').trim();
  return !!process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  try {
    await prisma.block.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
