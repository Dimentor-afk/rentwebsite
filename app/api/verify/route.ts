import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: render verification page with a Verify button
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.json({ success: false, error: 'missing token' }, { status: 400 });

    const booking = await prisma.booking.findFirst({ where: { approveToken: token } as any } as any);
    if (!booking) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });

    // If already approved, just show confirmation page
    if ((booking as any).status === 'approved') {
      const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:20px;padding:16px;color:#0f2a3d} .card{max-width:520px;margin:20px auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 6px 18px rgba(0,0,0,.06)} h2{margin:0 0 8px} p{margin:8px 0} .btn{display:block;width:100%;padding:12px;border-radius:10px;background:#2bbf9e;color:#fff;border:none;font-weight:600;text-align:center} .link{display:block;text-align:center;margin-top:12px;color:#0b6f5b}</style></head><body><div class="card"><h2>Booking already confirmed</h2><p>Your booking is already confirmed.</p><a class="link" href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}"><button class="btn">Return to site</button></a></div></body></html>`;
      return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
    }

    // show intermediate page with a Verify button (POSTs to same endpoint)
    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:20px;padding:16px;color:#0f2a3d} .card{max-width:520px;margin:20px auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 6px 18px rgba(0,0,0,.06)} h2{margin:0 0 8px} p{margin:8px 0} form{margin-top:12px} .btn{display:block;width:100%;padding:12px;border-radius:10px;background:#2bbf9e;color:#fff;border:none;font-weight:600;text-align:center} .link{display:block;text-align:center;margin-top:12px;color:#0b6f5b}</style></head><body><div class="card"><h2>Verify your email</h2><p>Click the button below to verify your email and send the booking request to the property owner.</p><form method="post" action="/api/verify?token=${encodeURIComponent(token)}"><button type="submit" class="btn">Verify Email</button></form><a class="link" href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}">Return to site</a></div></body></html>`;

    return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

// POST: perform verification (token must be included as query param or body)
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let token = url.searchParams.get('token');
    if (!token) {
      const body = await req.formData();
      token = body.get('token') as string | null;
    }
    if (!token) return NextResponse.json({ success: false, error: 'missing token' }, { status: 400 });

    const booking = await prisma.booking.findFirst({ where: { approveToken: token } as any } as any);
    if (!booking) return NextResponse.json({ success: false, error: 'not found' }, { status: 404 });

    // If already approved, show confirmation
    if ((booking as any).status === 'approved') {
      const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:20px;padding:16px;color:#0f2a3d} .card{max-width:520px;margin:20px auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 6px 18px rgba(0,0,0,.06)} h2{margin:0 0 8px} p{margin:8px 0} .btn{display:block;width:100%;padding:12px;border-radius:10px;background:#2bbf9e;color:#fff;border:none;font-weight:600;text-align:center} .link{display:block;text-align:center;margin-top:12px;color:#0b6f5b}</style></head><body><div class="card"><h2>Booking already confirmed</h2><p>Your booking is already confirmed.</p><a class="link" href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}"><button class="btn">Return to site</button></a></div></body></html>`;
      return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
    }

    // Check token TTL using booking.createdAt
    const ttlHours = Number(process.env.VERIFY_TOKEN_TTL_HOURS || 24);
    if ((booking as any).createdAt) {
      const created = new Date((booking as any).createdAt as any);
      const expires = new Date(created.getTime() + ttlHours * 3600 * 1000);
      if (new Date() > expires) {
        const html = `<html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:40px;text-align:center;"><h2>Verification link expired</h2><p>Your verification link has expired. Please resubmit your booking request.</p><p><a href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}"><button style="padding:12px 20px;border-radius:8px;background:#2bbf9e;color:#fff;border:none;cursor:pointer">Return to site</button></a></p></body></html>`;
        return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
      }
    }

    // Send booking to owner via SendGrid if configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        const ownerEmail = process.env.CONTACT_TO_EMAIL || 'koldmiand@gmail.com';
        const sgFrom = process.env.SENDGRID_FROM || ownerEmail || 'no-reply@localhost';
        const subject = `New verified booking request from ${booking.fullName} (${booking.email})`;
        const text = `Booking request:\n\nName: ${booking.fullName}\nPassport: ${booking.passport}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nCheck-in: ${booking.checkIn.toISOString().slice(0,10)}\nCheck-out: ${booking.checkOut.toISOString().slice(0,10)}\nGuests: ${booking.guests}\nNotes: ${booking.notes || '-'}\n\n(verified by guest)`;

        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ personalizations: [{ to: [{ email: ownerEmail }], subject }], from: { email: sgFrom }, content: [{ type: 'text/plain', value: text }] }),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('failed to send owner notification', err);
      }
    }

  // update booking status to 'pending' (owner/admin will see it in pending list) and clear token (one-time)
  await prisma.booking.update({ where: { id: booking.id } as any, data: ({ status: 'pending', approveToken: null } as any) as any });

    const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:20px;padding:16px;color:#0f2a3d} .card{max-width:520px;margin:20px auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 6px 18px rgba(0,0,0,.06)} h2{margin:0 0 8px} p{margin:8px 0} .btn{display:block;width:100%;padding:12px;border-radius:10px;background:#2bbf9e;color:#fff;border:none;font-weight:600;text-align:center} .link{display:block;text-align:center;margin-top:12px;color:#0b6f5b}</style></head><body><div class="card"><h2>Thank you — email verified</h2><p>Your booking request has been verified and sent to the property owner for processing.</p><a class="link" href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}"><button class="btn">Return to site</button></a></div></body></html>`;

    return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
