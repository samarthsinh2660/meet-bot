# Skriber - Meeting Intelligence Platform

Skriber is an autonomous meeting intelligence platform that deploys AI-powered bots to attend unlimited meetings simultaneously, providing HD recordings, intelligent transcripts, and actionable insights.

## Features

- **Landing Page** - Modern marketing site with hero, features, and CTAs
- **User Authentication** - Email/password login, Google OAuth, password reset
- **Dashboard** - Overview with stats, active bots, and recent meetings
- **Meeting Management** - Deploy bots, view meetings, control recordings
- **Settings** - User profile, password change, notifications
- **Dark Theme** - Consistent dark UI with glassmorphism effects

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Environment Setup

1. Copy the example environment file:

```sh
cp .env.example .env
```

2. Update the environment variables in `.env`:

```env
VITE_API_BASE_URL=https://api.skriber.in
VITE_APP_NAME=Skriber
```

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Project Structure

```
src/
├── api/                    # API layer
│   ├── client.ts           # Axios client with interceptors
│   ├── auth.ts             # Auth API endpoints
│   ├── meetings.ts         # Meeting bot API endpoints
│   └── types.ts            # TypeScript types
├── components/
│   ├── dashboard/          # Dashboard layout components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Landing page components
├── context/
│   ├── AuthContext.tsx     # Authentication state
│   └── SidebarContext.tsx  # Sidebar collapse state
├── hooks/
│   ├── useAuth.ts          # Auth React Query hooks
│   └── useMeetings.ts      # Meetings React Query hooks
├── pages/
│   ├── auth/               # Login, Register, Forgot Password
│   ├── dashboard/          # Dashboard, Meetings, Settings
│   └── Index.tsx           # Landing page
├── App.tsx                 # Root component with routing
└── main.tsx                # Entry point
```

## API Integration

The app connects to the Skriber backend API. Key endpoints:

- `POST /api/v1/auth/token` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/meeting-bot/meeting-url` - Deploy bot
- `GET /api/v1/meeting-bot/my-meetings` - List meetings
- `POST /api/v1/meeting-bot/meeting/{id}/stop` - Stop bot

## Deployment

Deploy the `dist/` folder to any static hosting provider:

- **Netlify** - Connect repo or drag & drop
- **Vercel** - Import from GitHub
- **Cloudflare Pages** - Connect repo

Set `VITE_API_BASE_URL` in your hosting provider's environment variables.

## License

Private - All rights reserved.
