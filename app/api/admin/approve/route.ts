import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

function isAuthorized(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.replace(/^Bearer\s+/, '').trim();
  return !!process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { id, token } = body;
    if (!id && !token) return NextResponse.json({ success: false, error: 'missing id or token' }, { status: 400 });

    // find booking
    const booking = await prisma.booking.findFirst({ where: (id ? { id } : { approveToken: token }) as any } as any);
    if (!booking) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });
    if ((booking as any).status === 'approved') return NextResponse.json({ success: false, error: 'already approved' }, { status: 400 });

    // create block
    await prisma.block.create({ data: { startDate: booking.checkIn, endDate: booking.checkOut, reason: `Booking ${booking.id}` } as any } as any);

    // update booking
    const now = new Date();
    await prisma.booking.update({ where: { id: booking.id } as any, data: ({ status: 'approved', approvedAt: now } as any) as any });

    // send confirmation to guest if configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgFrom = process.env.SENDGRID_FROM || process.env.CONTACT_TO_EMAIL || 'no-reply@localhost';
        const subject = `Your booking is confirmed`;
        const text = `Hello ${booking.fullName},\n\nYour booking for ${booking.checkIn.toISOString().slice(0,10)} → ${booking.checkOut.toISOString().slice(0,10)} has been confirmed.\n\nThank you!`;
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ personalizations: [{ to: [{ email: booking.email }], subject }], from: { email: sgFrom }, content: [{ type: 'text/plain', value: text }] }),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('failed to send guest confirmation', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

