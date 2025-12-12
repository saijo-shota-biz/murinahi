# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ムリな日カレンダー (Murinahi Calendar) is a reverse calendar scheduling app where participants select dates they **cannot** attend. Built with Next.js 15.4, React 19, TypeScript, and Upstash Redis.

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
npm test             # Run tests with Vitest (watch mode)
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
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with metadata
│   ├── actions.ts         # Server actions (createEvent, updateParticipant)
│   ├── event/[id]/        # Event page with calendar interface
│   ├── api/og/            # OG image generation endpoint
│   ├── robots.ts          # SEO robots configuration
│   └── sitemap.ts         # SEO sitemap generation
├── components/
│   ├── common/            # Shared components (AnimatedBackground, GlobalStyles)
│   ├── event/             # Calendar and participant components
│   ├── home/              # Landing page components
│   ├── layout/            # Layout components (Footer)
│   ├── share/             # Share functionality (Twitter, clipboard)
│   └── ui/                # Reusable UI components (Button, Input, Card)
├── services/
│   ├── eventService.ts    # Event CRUD operations
│   └── participantService.ts # Participant management
├── hooks/                 # Custom React hooks (useClipboard, useEventState)
├── utils/                 # Helper functions (dateHelpers, validation)
├── types/                 # TypeScript type definitions
└── test/                  # Test setup and utilities
```

### Key Technical Decisions
- **Biome** for linting and formatting (line width: 120, double quotes, auto-organize imports)
- **Upstash Redis** for serverless data persistence
- **Server Actions** for form handling (no API routes except OG images)
- **Tailwind CSS v4** with PostCSS
- **Vitest** for testing with React Testing Library
- **@vercel/og** for dynamic OG image generation

### Environment Variables
Required in `.env`:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Testing Strategy
- Tests in `__tests__/` subdirectories within each component folder
- Test setup in `src/test/setup.ts`
- Mock Redis client in tests to avoid external dependencies

### Important Patterns
- All dates are stored as `YYYY-MM-DD` strings
- Redis keys: `event:{id}` with 30-day expiration
- Custom validation functions in `src/utils/validation.ts`
- Error handling with proper user feedback (Japanese messages)
- Mobile-first responsive design