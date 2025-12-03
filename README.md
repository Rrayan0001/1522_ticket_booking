# 1522 Event Ticket Booking System

Premium event ticket booking platform for 1522 - The Pub.

## Features

- 🎫 Real-time ticket booking with QR code generation
- 📱 Mobile-responsive design optimized for all devices
- 🤖 AI-powered UTR extraction from payment screenshots
- 🔐 Secure OTP-based authentication
- 📊 Admin dashboard for ticket verification
- ✨ Premium UI with gold/black aesthetic

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display, Inter
- **Icons**: Lucide React
- **Authentication**: Supabase Auth

### Backend
- **Runtime**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **AI/OCR**: Groq AI (llama-4-scout)
- **Language**: TypeScript

## Project Structure

```
1522_ticket/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   └── lib/
│   └── public/       # Static assets
│
└── backend/          # Express API server
    ├── src/
    │   ├── routes/   # API endpoints
    │   └── middleware/
    └── dist/         # Compiled TypeScript
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key

### Environment Variables

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env)**:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
PORT=5001
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd 1522_ticket
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

4. **Build backend**
```bash
npm run build
```

### Running Locally

1. **Start backend** (from backend folder):
```bash
npm run dev
# or
node dist/index.js
```

2. **Start frontend** (from frontend folder):
```bash
npm run dev
```

3. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy!

### Backend (Railway/Render)
1. Create new service
2. Connect GitHub repository
3. Set root directory to `backend`
4. Set build command: `npm run build`
5. Set start command: `node dist/index.js`
6. Add environment variables
7. Deploy!

## Available Routes

### Customer Routes
- `/` - Landing page
- `/auth/customer` - Customer authentication
- `/book` - Event booking interface  
- `/ticket_cart` - View booked tickets
- `/terms` - Terms & Conditions
- `/privacy` - Privacy Policy

### Admin Routes
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin dashboard
- `/admin/scan` - QR code scanner for entry

## API Endpoints

- `POST /api/auth/send-otp` - Send OTP for authentication
- `POST /api/tickets` - Create new ticket booking
- `POST /api/tickets/extract-utr` - Extract UTR from payment screenshot
- `GET /api/admin/tickets` - Get all tickets (admin)
- `POST /api/scan/verify` - Verify ticket QR code

## License

Proprietary - 1522 The Pub

## Support

For issues or questions, contact: support@1522thepub.com
