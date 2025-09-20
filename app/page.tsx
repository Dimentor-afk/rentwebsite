

"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { AnimatePresence, motion } from "framer-motion";

const status: "available" | "unavailable" = "available";

const navLinks = [
  { label: "Gallery", href: "#gallery" },
  { label: "Amenities", href: "#amenities" },
  { label: "Contact", href: "#contact" },
] as const;

const galleryImages = [
  { src: "/gallery/photo1.jpg", alt: "Ocean-view suite balcony" },
  { src: "/gallery/photo2.jpg", alt: "Sunlit living room" },
  { src: "/gallery/photo3.jpg", alt: "Poolside lounge" },
  { src: "/gallery/photo4.jpg", alt: "Gourmet kitchen" },
  { src: "/gallery/photo5.jpg", alt: "Bedroom with sea view" },
  { src: "/gallery/photo6.jpg", alt: "Evening terrace" },
] as const;

const amenities = [
  {
    title: "Resort Wi-Fi",
    description:
      "Secure fibre-backed Wi-Fi in every suite and across all shared areas, perfect for work or streaming nights in.",
    icon: (
      <svg
        aria-hidden="true"
        className="h-8 w-8 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 9.5a12 12 0 0 1 16 0" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 13.5a7.5 7.5 0 0 1 9 0" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 17.5a3 3 0 0 1 3 0" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="20" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Beach In Minutes",
    description:
      "Step outside and feel the sand - the shoreline is a relaxed three-minute walk from your private lobby.",
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 16c2.5 1.5 4.5 1.5 7 0s4.5-1.5 7 0 4.5 1.5 7 0" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10c1.5-2.5 4-4 6-4s4.5 1.5 6 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6V3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Signature Dining",
    description:
      "On-site restaurant with coastal cuisine, seasonal tasting menus, and chef's table experiences.",
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 4v8" strokeLinecap="round" />
        <path d="M9 4v8" strokeLinecap="round" />
        <path d="M5 8h4" strokeLinecap="round" />
        <path d="M14 4c1.5 0 3 1.2 3 3.2 0 1.8-1.2 3.3-3 3.3v3.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="18" x2="16" y2="18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sunset Bar",
    description: "Skyline bar pouring handcrafted cocktails, live acoustic sets, and uninterrupted ocean sunsets.",
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 16h16" strokeLinecap="round" />
        <path d="M6 16l1.5-7H16L17.5 16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9V5a3 3 0 0 1 6 0v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Family-Friendly",
    description:
      "Spacious suites, dedicated play corners, and babysitting on request so everyone unwinds together.",
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8" cy="7" r="2.2" />
        <circle cx="16" cy="7" r="2.2" />
        <path d="M4 20c0-3 2.5-5.5 5.5-5.5h1c3 0 5.5 2.5 5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12.5c1.8 0 3.5.9 4.6 2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Pet Welcome",
    description:
      "Bring furry companions - welcome kits, seaside walking paths, and pet-sitting partners on call.",
    icon: (
      <svg aria-hidden="true" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 13c-2 0-3.5 1.6-3.5 3.6 0 2 1.6 3.4 3.5 3.4s3.5-1.4 3.5-3.4C15.5 14.6 14 13 12 13Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="11.5" r="2" />
        <circle cx="17.5" cy="11.5" r="2" />
        <circle cx="8.8" cy="6.8" r="2.1" />
        <circle cx="15.2" cy="6.8" r="2.1" />
      </svg>
    ),
  },
];

const badgeStyles = {
  available: {
    label: "Rooms Available",
    dotClass: "bg-[#1f7a4d]",
    gradientClass: "from-[#1f7a4d] via-[#29a868] to-[#37c27f]",
    borderClass: "border-[#1f7a4d]/45",
  },
  unavailable: {
    label: "No Rooms \u2014 Sorry",
    dotClass: "bg-[#b82020]",
    gradientClass: "from-[#b82020] via-[#d13a3a] to-[#f25555]",
    borderClass: "border-[#b82020]/45",
  },
} satisfies Record<"available" | "unavailable", { label: string; dotClass: string; gradientClass: string; borderClass: string }>;

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  // inline validation error states
  const [fullNameErr, setFullNameErr] = useState<string>('');
  const [passportErr, setPassportErr] = useState<string>('');
  const [phoneErr, setPhoneErr] = useState<string>('');
  const [emailErr, setEmailErr] = useState<string>('');
  // Booking form date state
  // helpers to format/parse dates in local yyyy-mm-dd to avoid timezone shifts
  const formatDateLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const parseDateLocal = (s: string) => {
    const [y, m, d] = s.split('-').map((n) => Number(n));
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const [checkIn, setCheckIn] = useState<string>(() => {
    const d = new Date();
    return formatDateLocal(d);
  });
  const [checkOut, setCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDateLocal(d);
  });
  const [range, setRange] = useState<DateRange | undefined>({ from: parseDateLocal(checkIn), to: parseDateLocal(checkOut) });
  const [blockedRanges, setBlockedRanges] = useState<Array<{ startDate: string; endDate: string }>>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // fetch blocked ranges from server
    (async () => {
      try {
        const res = await fetch('/api/blocks');
        const json = await res.json();
        if (json?.success) {
          setBlockedRanges(json.blocks || []);
        }
      } catch (err) {
        // ignore
      }
    })();

    // fetch already booked ranges (approved & pending) and merge so they are disabled in calendar
    (async () => {
      try {
        const res = await fetch('/api/booked');
        const json = await res.json();
        if (json?.success) {
          const booked = (json.ranges || []).map((r: any) => ({ startDate: r.startDate, endDate: r.endDate }));
          // merge with existing blockedRanges
          setBlockedRanges((prev) => {
            const merged = [...(prev || [])];
            for (const b of booked) {
              // avoid duplicates
              if (!merged.find((m) => m.startDate === b.startDate && m.endDate === b.endDate)) merged.push(b);
            }
            return merged;
          });
        }
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    // close calendar when clicking outside
    const handleDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('click', handleDoc);
    return () => document.removeEventListener('click', handleDoc);
  }, [showCalendar]);

  useEffect(() => {
    // keep checkIn/checkOut strings in sync with range (use local formatting)
    if (range?.from) setCheckIn(formatDateLocal(range.from as Date));
    if (range?.to) setCheckOut(formatDateLocal(range.to as Date));
  }, [range]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const badge = badgeStyles[status];
  const totalSlides = galleryImages.length;

  const goToSlide = (direction: "prev" | "next") => {
    setActiveSlide((prev) => {
      if (direction === "prev") return prev === 0 ? totalSlides - 1 : prev - 1;
      return prev === totalSlides - 1 ? 0 : prev + 1;
    });
  };

  // Called when user finishes a drag action on the gallery image
  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    const threshold = 80; // minimum px to consider a swipe
    if (info.offset.x > threshold) {
      goToSlide("prev");
    } else if (info.offset.x < -threshold) {
      goToSlide("next");
    }
  };

  // prevent selecting a range that includes any blocked/booked dates
  const isRangeOverlappingBlocked = (from: Date, to: Date) => {
    for (const b of blockedRanges) {
      try {
        const bs = parseDateLocal(b.startDate);
        const be = parseDateLocal(b.endDate);
        // if bs <= to && be >= from -> overlap (inclusive)
        if (bs <= to && be >= from) return true;
      } catch (err) {
        // ignore malformed entries
      }
    }
    return false;
  };

  const handleSelectRange = (r: DateRange | undefined) => {
    // Clear any previous message when user changes selection
    setMessage(null);

    if (!r) {
      setRange(undefined);
      return;
    }

    const from = r.from as Date | undefined;
    const to = r.to as Date | undefined;

    if (from && to) {
      // normalize to date-only
      const nf = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const nt = new Date(to.getFullYear(), to.getMonth(), to.getDate());
      if (isRangeOverlappingBlocked(nf, nt)) {
        // set an error and keep it until user picks new dates
        setMessage({ type: 'error', text: 'Selected range includes unavailable dates. Please choose another range.' });
        // keep previous range unchanged (do not set the invalid range)
        return;
      }
      // valid range: store it and ensure message is cleared
      setRange({ from: nf, to: nt });
      setMessage(null);
    } else {
      // partial selection (user picking from or to) — clear message so UI isn't stuck
      setRange(r);
    }
  };

  return (
    <div className="relative min-h-screen bg-base text-body">
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${isScrolled ? "border-white/20" : "border-transparent"} bg-[rgba(20,34,46,0.55)] backdrop-blur-md`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-8 lg:px-12">
          <Link href="#home" className="flex items-center gap-4 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-semibold text-white shadow-lg shadow-[rgba(59,185,179,0.35)]">SV</span>
            <span className="text-2xl font-semibold tracking-[0.14em] uppercase">SeaVista</span>
          </Link>

          <nav className="hidden items-center gap-12 lg:flex" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isContact = link.label === "Contact";
              return (
                <Link key={link.href} href={link.href} className={`text-lg font-semibold uppercase tracking-[0.18em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${isContact ? "rounded-full bg-accent px-8 py-3.5 text-[#0f1f2d] shadow-lg shadow-[rgba(59,185,179,0.35)] hover:bg-[#35a9a4]" : "relative text-white/85 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-white/70 after:transition after:duration-200 hover:after:scale-x-100"}`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button type="button" className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/35 text-white transition hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:hidden" aria-label="Toggle navigation" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((p) => !p)}>
            <span className="sr-only">Menu</span>
            <div className="relative h-6 w-6" aria-hidden>
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-white transition ${isMenuOpen ? "translate-y-2.5 rotate-45" : "-translate-y-2.5"}`} />
              <span className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white transition ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-full bg-white transition ${isMenuOpen ? "-translate-y-2.5 -rotate-45" : "translate-y-2.5"}`} />
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden">
            <nav aria-label="Mobile navigation" className="mx-5 mb-5 space-y-3 rounded-3xl border border-white/20 bg-[rgba(20,34,46,0.92)] p-6 backdrop-blur-md">
              {navLinks.map((link) => {
                const isContact = link.label === "Contact";
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className={`block rounded-2xl px-5 py-3 text-base font-semibold uppercase tracking-[0.24em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${isContact ? "bg-accent text-[#0f1f2d] shadow-lg shadow-[rgba(59,185,179,0.35)] hover:bg-[#35a9a4]" : "text-white/85 hover:bg-white/10 hover:text-white"}`}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mist">
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          {/* subtle top overlay for readability */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[rgba(12,24,35,0.45)] to-transparent" />
          <span className="visually-hidden">Coastal villa overlooking turquoise water and a bright sky.</span>
          <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-36 sm:px-8 md:px-10 lg:py-44">
            {/* Focus-frame hero: no frosted panel; text sits directly on image */}
            <motion.div variants={cardVariants} initial="hidden" animate="show" className="relative mx-auto w-full flex items-center justify-center">
              <div className="relative w-[92vw] max-w-[820px]">
                {/* corner frame (four L-shaped corners) */}
                {/* top-left */}
                <div className="pointer-events-none absolute left-0 top-0 z-10">
                  <div className="bg-[rgba(255,255,255,0.9)] h-2 w-9 md:h-3 md:w-16" />
                  <div className="bg-[rgba(255,255,255,0.9)] w-2 h-9 md:w-3 md:h-16 mt-0" />
                </div>
                {/* top-right */}
                <div className="pointer-events-none absolute right-0 top-0 z-10">
                  <div className="bg-[rgba(255,255,255,0.9)] h-2 w-9 md:h-3 md:w-16 ml-auto" />
                  <div className="bg-[rgba(255,255,255,0.9)] w-2 h-9 md:w-3 md:h-16 mt-0 ml-auto" />
                </div>
                {/* bottom-left (arms point inward) */}
                <div className="pointer-events-none absolute left-0 bottom-0 z-10">
                  <div className="absolute left-0 bottom-0 bg-[rgba(255,255,255,0.9)] h-2 w-9 md:h-3 md:w-16" />
                  <div className="absolute left-0 bottom-0 bg-[rgba(255,255,255,0.9)] w-2 h-9 md:w-3 md:h-16" />
                </div>
                {/* bottom-right (arms point inward) */}
                <div className="pointer-events-none absolute right-0 bottom-0 z-10">
                  <div className="absolute right-0 bottom-0 bg-[rgba(255,255,255,0.9)] h-2 w-9 md:h-3 md:w-16" />
                  <div className="absolute right-0 bottom-0 bg-[rgba(255,255,255,0.9)] w-2 h-9 md:w-3 md:h-16" />
                </div>

                {/* centered text stack */}
                <motion.div variants={itemVariants} className="relative z-20 mx-auto w-[92vw] max-w-[780px] text-center px-4 py-8 md:px-8 md:py-10">
                  <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,255,255,0.88)] mb-3">Escape to Miami</span>
                  <motion.h1 variants={itemVariants} style={{fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: 1.06, textShadow: '0 8px 16px rgba(0,0,0,0.45)'}} className="font-extrabold text-white">Beachfront Apartments</motion.h1>
                  <motion.p variants={itemVariants} className="mt-3 text-lg font-semibold text-[rgba(255,255,255,0.95)]">123 Ocean Drive, Miami, FL</motion.p>

                  {/* status pill removed as requested */}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

  <div className="relative isolate green-band px-5 pb-20 pt-12 sm:px-8 md:px-10 lg:pb-24 section-gap-before-green">
          <section id="gallery" className="mx-auto flex w-full max-w-6xl flex-col gap-10">
            <div className="flex flex-col gap-3 text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Gallery</h2>
              <p className="max-w-2xl text-base font-medium text-heading">A glimpse of SeaVista life - bright interiors, coastal textures, and the turquoise horizon just outside.</p>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={galleryImages[activeSlide].src}
                  src={galleryImages[activeSlide].src}
                  alt={galleryImages[activeSlide].alt}
                  className="aspect-[16/9] w-full object-cover"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={handleDragEnd}
                  whileTap={{ cursor: "grabbing" }}
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={() => goToSlide("prev")}
                className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                aria-label="Previous photo"
              >
                <span aria-hidden className="text-2xl font-bold">‹</span>
              </button>

              <button
                type="button"
                onClick={() => goToSlide("next")}
                className="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                aria-label="Next photo"
              >
                <span aria-hidden className="text-2xl font-bold">›</span>
              </button>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {galleryImages.map((image, index) => (
                  <button key={image.src} type="button" onClick={() => setActiveSlide(index)} className={`h-2.5 w-2.5 rounded-full transition ${activeSlide === index ? "bg-white" : "bg-white/40"}`} aria-label={`View slide ${index + 1}`} aria-current={activeSlide === index} />
                ))}
              </div>
            </div>
          </section>
        </div>

    <section id="amenities" className="mx-auto mt-28 w-full max-w-6xl px-5 sm:px-8 md:px-10">
          <div className="flex flex-col gap-3 text-left px-5 sm:px-8 md:px-10">
            <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Amenities</h2>
            <p className="max-w-3xl text-base font-medium text-heading">Crafted for unwinding and staying connected - every stay balances luxe comfort with effortless convenience.</p>
          </div>
          <div className="mt-12 section-gap-after-amenities">
            <div className="amenities-grid">
              {amenities.map((item) => (
                <div key={item.title} className="amenity-card transition">
                  <div className="amenity-icon flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl">{item.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-heading">{item.title}</h3>
                    <p className="text-base text-heading">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[rgba(217,241,241,0.85)] px-5 py-24 text-center sm:px-8 md:px-10 lg:py-32">
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">Reserve Your Stay</h2>
              <p className="text-lg font-semibold text-heading">You can secure your suite instantly via {' '}<a href="https://www.booking.com" target="_blank" rel="noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">Booking.com</a>{' '}or send us a tailored booking request below.</p>
            </div>
      <form id="bookingForm" className="grid gap-6 rounded-3xl border border-white/40 bg-white/70 p-8 text-left shadow-xl backdrop-blur" onSubmit={async (e) => {
                e.preventDefault();
                // gather form data
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const payload = {
                  fullName: String(data.get('fullName') || ''),
                  passport: String(data.get('passport') || ''),
                  email: String(data.get('email') || ''),
                  phone: String(data.get('phone') || ''),
                  checkIn,
                  checkOut,
                  guests: String(data.get('guests') || ''),
                  notes: String(data.get('notes') || ''),
                };

                // client-side validation
                const emailVal = payload.email;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailVal)) {
                  alert('Please enter a valid email address');
                  return;
                }
                // Full name: only English letters and spaces
                const nameRegex = /^[A-Za-z\s]+$/;
                if (!nameRegex.test(String(payload.fullName || ''))) {
                  alert('Full name must contain only English letters and spaces');
                  return;
                }
                // Passport: two letters followed by at least 6 digits
                const passportRegex = /^[A-Za-z]{2}\d{6,}$/;
                if (!passportRegex.test(String(payload.passport || ''))) {
                  alert('Passport must be in format: two letters followed by at least 6 digits (e.g., AB123456)');
                  return;
                }
                // Phone: must start with + and have at least 8 digits after +
                const phoneRegex = /^\+\d{8,}$/;
                if (!phoneRegex.test(String(payload.phone || ''))) {
                  alert('Phone must start with + and contain at least 8 digits after the plus sign');
                  return;
                }

                // server-side check against persistent blocked ranges will also run, but do a quick client check
                try {
                  const resBlocks = await fetch('/api/blocks');
                  const jsonBlocks = await resBlocks.json();
                  const blocked = jsonBlocks?.blocks || [];
                  const from = parseDateLocal(checkIn);
                  const to = parseDateLocal(checkOut);
                  // limit selection to 2 months ahead
                  const maxLimit = new Date();
                  maxLimit.setMonth(maxLimit.getMonth() + 2);
                  if (from > maxLimit || to > maxLimit) {
                    setMessage({ type: 'error', text: 'Please select dates no more than 2 months from today' });
                    return;
                  }
                  for (const b of blocked) {
                    const bs = parseDateLocal(b.startDate);
                    const be = parseDateLocal(b.endDate);
                    // overlap if bs <= to && be >= from (inclusive)
                    if (bs <= to && be >= from) {
                      setMessage({ type: 'error', text: 'Selected dates overlap blocked dates. Choose different dates.' });
                      return;
                    }
                  }
                } catch (err) {
                  // ignore and rely on server validation
                }

                // send to API
                setMessage({ type: 'info', text: 'Sending booking request...' });
                const res = await fetch('/api/send-booking', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
                const json = await res.json();
                if (json?.success) {
                  // inform guest that a verification email was sent and owner will only be notified after confirmation
                  setMessage({ type: 'success', text: 'Please verify your email — a confirmation message was sent to your address. The owner will be notified only after you confirm.' });
                  form.reset();
                  // clear inline errors after reset
                  setFullNameErr(''); setPassportErr(''); setPhoneErr(''); setEmailErr('');
                } else {
                  setMessage({ type: 'error', text: `Failed to send booking request: ${json?.error || 'unknown error'}` });
                }
              }}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-heading">Full name
                  <input type="text" name="fullName" required placeholder="Jane Doe" onInput={(e) => {
                    const v = (e.target as HTMLInputElement).value;
                    if (!/^[A-Za-z\s]*$/.test(v)) setFullNameErr('Only English letters and spaces allowed'); else setFullNameErr('');
                  }} className={`rounded-xl border border-white/50 bg-white px-4 py-3 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 ${fullNameErr ? 'border-red-400' : ''}`} />
                  {fullNameErr && <div className="text-sm text-red-600">{fullNameErr}</div>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-heading">Passport number
                  <input type="text" name="passport" required placeholder="AB123456" onInput={(e) => {
                    const v = (e.target as HTMLInputElement).value;
                    if (!/^[A-Za-z]{0,2}\d{0,}$/.test(v) || (v.length >= 3 && !/^[A-Za-z]{2}\d{6,}$/.test(v))) setPassportErr('Format: two letters followed by at least 6 digits (e.g., AB123456)'); else setPassportErr('');
                  }} className={`rounded-xl border border-white/50 bg-white px-4 py-3 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 ${passportErr ? 'border-red-400' : ''}`} />
                  {passportErr && <div className="text-sm text-red-600">{passportErr}</div>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-heading">Email
                  <input type="email" name="email" required placeholder="guest@email.com" onInput={(e) => {
                    const v = (e.target as HTMLInputElement).value;
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setEmailErr('Invalid email format'); else setEmailErr('');
                  }} className={`rounded-xl border border-white/50 bg-white px-4 py-3 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 ${emailErr ? 'border-red-400' : ''}`} />
                  {emailErr && <div className="text-sm text-red-600">{emailErr}</div>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-heading">Phone number
                  <input type="tel" name="phone" required placeholder="+380501234567" onInput={(e) => {
                    const v = (e.target as HTMLInputElement).value;
                    if (!/^\+\d{0,}$/.test(v) || (v.length >= 2 && !/^\+\d{8,}$/.test(v))) setPhoneErr('Phone must start with + and contain at least 8 digits'); else setPhoneErr('');
                  }} className={`rounded-xl border border-white/50 bg-white px-4 py-3 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 ${phoneErr ? 'border-red-400' : ''}`} />
                  {phoneErr && <div className="text-sm text-red-600">{phoneErr}</div>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-heading">
                  Dates
                    <div>
                    <button type="button" aria-expanded={showCalendar} onClick={() => setShowCalendar((s) => !s)} className="w-full h-14 rounded-xl border border-white/50 bg-white px-4 text-base text-heading text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40">
                      <div className="flex h-full items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{checkIn} → {checkOut}</div>
                        </div>
                        <div className="text-sm text-heading/60">▾</div>
                      </div>
                    </button>
                    {showCalendar && (() => {
                      const max = new Date();
                      max.setMonth(max.getMonth() + 2);
                      const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate());
                      return (
                        <div className="mt-3 rounded border bg-white p-3">
                          <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={(r) => handleSelectRange(r as DateRange | undefined)}
                            disabled={[{ before: new Date() }, { after: maxDate }, ...blockedRanges.map((b) => ({ from: parseDateLocal(b.startDate), to: parseDateLocal(b.endDate) }))]}
                          />
                        </div>
                      );
                    })()}
                    <input type="hidden" name="checkIn" value={checkIn} />
                    <input type="hidden" name="checkOut" value={checkOut} />
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-heading">
                  Guests
                  <input type="number" name="guests" min={1} max={6} required placeholder="2" defaultValue={2} className="h-14 rounded-xl border border-white/50 bg-white px-4 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-heading md:col-span-2">Additional notes
                  <textarea name="notes" rows={3} placeholder="Let us know about special requests or arrival details." className="rounded-xl border border-white/50 bg-white px-4 py-3 text-base text-heading shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                </label>
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-[#0f1f2d] shadow-lg shadow-[rgba(59,185,179,0.35)] transition hover:bg-[#35a9a4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading">Send Booking Request</button>
              <div className="mt-3">
                {message?.text && (
                  <div className={`rounded-md p-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                    {message.text}
                  </div>
                )}
              </div>
              {/* Owner contact is kept private; do not display owner email here */}
            </form>

            {/* Admin blocking moved server-side; removed local admin block controls */}
          </div>
        </section>
      </main>
    </div>
  );
}