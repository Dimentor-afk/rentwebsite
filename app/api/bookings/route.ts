import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, passport, email, phone, checkIn, checkOut, guests, notes } = body;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);

    // check blocks overlap
    const overlapping = await prisma.block.findMany({ where: { OR: [ { startDate: { lte: co } }, { endDate: { gte: ci } } ] } });
    for (const b of overlapping) {
      // if any overlap in range => block
      if (!(co <= b.startDate || ci >= new Date(b.endDate.getFullYear(), b.endDate.getMonth(), b.endDate.getDate()+1))) {
        return NextResponse.json({ error: 'dates blocked' }, { status: 400 });
      }
    }

    const created = await prisma.booking.create({ data: { fullName, passport, email, phone, checkIn: ci, checkOut: co, guests: Number(guests), notes } });

    return NextResponse.json({ success: true, booking: created });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
