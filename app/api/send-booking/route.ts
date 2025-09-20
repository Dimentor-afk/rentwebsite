import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import crypto from 'crypto';

// POST /api/send-booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      passport,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      notes,
    } = body;

    const ownerEmail = process.env.CONTACT_TO_EMAIL || 'koldmiand@gmail.com';

    const isValidEmail = (s: any) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'invalid sender email' }, { status: 400 });
    }
    if (!isValidEmail(ownerEmail)) {
      return NextResponse.json({ success: false, error: 'invalid recipient email configured' }, { status: 500 });
    }

    // Server-side input validation to match client rules
    if (!/^[A-Za-z\s]+$/.test(String(fullName || ''))) {
      return NextResponse.json({ success: false, error: 'fullName must contain only English letters and spaces' }, { status: 400 });
    }
    if (!/^[A-Za-z]{2}\d{6,}$/.test(String(passport || ''))) {
      return NextResponse.json({ success: false, error: 'passport must be two letters followed by at least 6 digits' }, { status: 400 });
    }
    if (!/^\+\d{8,}$/.test(String(phone || ''))) {
      return NextResponse.json({ success: false, error: 'phone must start with + and contain at least 8 digits' }, { status: 400 });
    }

    const subject = `New booking request from ${fullName} (${email})`;
    const text = `Booking request:\n\nName: ${fullName}\nPassport: ${passport}\nEmail: ${email}\nPhone: ${phone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nNotes: ${notes || '-'}\n`;

    // server-side overlap checks: blocks
  const fromDate = new Date(checkIn);
  const toDate = new Date(checkOut);
    const overlappingBlock = await prisma.block.findFirst({ where: ({
      AND: [
        { startDate: { lt: toDate } },
        { endDate: { gt: fromDate } },
      ],
    } as any) } as any);
    if (overlappingBlock) {
      return NextResponse.json({ success: false, error: 'Selected dates overlap an existing blocked range' }, { status: 400 });
    }

    // also check already approved bookings
    const overlappingApproved = await prisma.booking.findFirst({ where: ({
      AND: [
        { status: 'approved' },
        { checkIn: { lt: toDate } },
        { checkOut: { gt: fromDate } },
      ],
    } as any) } as any);
    if (overlappingApproved) {
      return NextResponse.json({ success: false, error: 'Selected dates overlap an existing approved booking' }, { status: 400 });
    }

    // persist booking as pending with approve token
    const token = crypto.randomBytes(20).toString('hex');
    const saved = await prisma.booking.create({ data: ({
      fullName,
      passport,
      email,
      phone,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests || 1),
      notes,
      approveToken: token,
    } as any) as any });

    // Send verification email to guest (they must click to confirm)
    if (process.env.SENDGRID_API_KEY) {
      // Do NOT fall back to the owner email as the sender. Use explicit SENDGRID_FROM or a no-reply address.
      const sgFrom = process.env.SENDGRID_FROM || 'no-reply@localhost';
  // Use NEXT_PUBLIC_BASE_URL if provided; otherwise use the local machine LAN IP so other devices can reach it.
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.0.105:3000'}/api/verify?token=${token}`;
    const guestSubject = `Please verify your email to confirm your booking request.`;
    const ttlHours = Number(process.env.VERIFY_TOKEN_TTL_HOURS || 24);
    // Simple English verification text as requested
    const guestBody = `Please verify your email to confirm your booking request.\n\n${verifyUrl}\n\nThis link will expire in ${ttlHours} hours.`;

      const payload = {
        personalizations: [{ to: [{ email }], subject: guestSubject }],
        from: { email: sgFrom },
        content: [{ type: 'text/plain', value: guestBody }],
      };

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const bodyText = await res.text();
        return NextResponse.json({ success: false, error: `sendgrid error: ${res.status} ${bodyText}` }, { status: 502 });
      }

      return NextResponse.json({ success: true, provider: 'sendgrid', note: 'verification_email_sent' });
    }

    // fallback: no email provider configured
    // eslint-disable-next-line no-console
    console.log('[send-booking] no email provider configured; saved booking (pending):', saved);
    return NextResponse.json({ success: true, note: 'no_email_provider; saved_pending' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
