# BAFMI – Beachfront Apartments Website 🌊🏡

**BAFMI** is a modern website for managing beachfront apartments, built with **React (Next.js)**.  
The project implements online booking, email verification, admin management, and flexible UI design.  

---

## 🔑 Key Features
- **Apartments showcase** – landing page with hero section, photos, description, and benefits.
- **Online booking**:
  - clients can submit booking requests;
  - booking requests are forwarded automatically to the configured email.
- **User verification**:
  - email verification via a unique link;
  - optional extension: phone verification via SMS/OTP.
- **Admin panel**:
  - admin can view all booking requests;
  - approve or reject reservations;
  - manage availability and content dynamically.
- **Database integration**:
  - all data is stored securely in a connected database;
  - scalable for additional features and integrations.
- **Flexible design**:
  - responsive layout optimized for desktop and mobile;
  - fully customizable UI – styles and components can be adjusted easily.

---

## 🚀 Tech Stack
- **Frontend**: React, Next.js  
- **Styling**: TailwindCSS + Framer Motion animations  
- **Backend**: Next.js API routes  
- **Database**: Integrated (can be expanded to PostgreSQL, MongoDB, or others)  
- **Email service**: SendGrid for sending and verifying booking requests  

---

## 📩 Booking Flow
1. User fills out the booking form.  
2. The system sends a **verification email** to the client.  
3. After clicking the verification link, the booking request is:  
   - delivered to the admin’s email;  
   - stored in the database;  
   - visible in the admin panel for approval or rejection.  

---

## 🔧 Improvements
- Phone number verification via SMS.  
- Payment gateway integration (Stripe, PayPal).  
- Multi-language support.   

---

## 📸 Screenshots
- ![Screenshot 1](public\screenshots\screenshot1.png)  
- ![Screenshot 2](public\screenshots\screenshot2.png)  
- ![Screenshot 3](public\screenshots\screenshot3.png)  




