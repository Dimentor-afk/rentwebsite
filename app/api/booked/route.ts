import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// public endpoint returning approved and pending booking ranges to render as disabled in calendar
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ where: { status: { in: ['approved','pending'] } }, orderBy: { checkIn: 'asc' } });
  const ranges = bookings.map((b: any) => ({ startDate: b.checkIn.toISOString().slice(0,10), endDate: b.checkOut.toISOString().slice(0,10) }));
    return NextResponse.json({ success: true, ranges });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
