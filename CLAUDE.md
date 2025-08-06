# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ムリな日カレンダー (Murinahi Calendar) is a reverse calendar scheduling app where participants select dates they **cannot** attend. Built with Next.js 15, TypeScript, and Upstash Redis.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server

# Code Quality - ALWAYS run before committing
npm run lint         # Lint with Biome
npm run format       # Format with Biome

# Testing
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once (CI mode)
```

## Architecture

### Data Model
- **Event**: `{ id, title, participants, createdAt }` - Stored in Redis with 30-day TTL
- **Participant**: `{ ng_dates: string[], name?: string }` - Unavailable dates per participant

### Key Application Flow
1. **Home** (`/`) → Create event → Get shareable URL
2. **Event** (`/event/[id]`) → Select unavailable dates → View combined results
3. Server actions handle all data mutations via Upstash Redis

### Project Structure
```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── actions/      # Server actions (createEvent, updateParticipant)
│   └── event/[id]/   # Event page with calendar interface
├── components/       # Feature-based component organization
│   ├── home/         # Landing page components
│   ├── event/        # Calendar and participant components
│   ├── share/        # Share functionality (Twitter, clipboard)
│   └── ui/           # Reusable UI components
├── services/         # Business logic layer
│   ├── eventService.ts      # Event CRUD operations
│   └── participantService.ts # Participant management
├── hooks/            # Custom React hooks
├── utils/            # Helper functions (dates, validation)
└── types/            # TypeScript type definitions
```

### Key Technical Decisions
- **Biome** instead of ESLint/Prettier (configured in biome.json)
- **Upstash Redis** for serverless data persistence
- **Server Actions** for form handling (no API routes)
- **Tailwind CSS v4** with PostCSS
- **Vitest** for testing with React Testing Library

### Environment Variables
Required in `.env`:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Testing Strategy
- Component tests co-located with components (`*.test.tsx`)
- Test utilities in `src/test/test-utils.tsx`
- Mock Redis client in tests to avoid external dependencies

### Important Patterns
- All dates are stored as `YYYY-MM-DD` strings
- Redis keys: `event:{id}` with 30-day expiration
- Form validation uses Zod schemas
- Error handling with proper user feedback
- Mobile-first responsive design