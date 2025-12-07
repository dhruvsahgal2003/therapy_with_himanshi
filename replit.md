# Therapy with Himanshi - Website

## Overview

A modern, clean therapy practice website for psychologist Himanshi featuring appointment booking, payment integration, and contact management. Built with a soft pink and white aesthetic for a warm, calming user experience. The application is a full-stack React/Express monorepo with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing (routes: `/`, `/book`, `/payment`)

**UI Framework & Styling**
- Shadcn/ui component library (New York variant) with Radix UI primitives
- Tailwind CSS v4 with custom pink/white color palette
- Framer Motion for smooth animations and transitions
- Custom fonts: Poppins for headings, Inter for body text

**State Management**
- TanStack React Query for server state management and caching
- React Hook Form with Zod validation for form handling

**Key Design Decisions**
- Component-based architecture with reusable UI primitives in `/client/src/components/ui`
- Page-level components in `/client/src/pages` (Home, Book, Payment, NotFound)
- Section-based home page composition (Hero, About, Services, Contact)
- Mobile-first responsive design with custom breakpoint hooks

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- HTTP server setup (no WebSocket requirements currently)
- Development mode uses Vite middleware for hot module replacement

**API Design**
- RESTful endpoints under `/api` prefix
- Contact form submission: `POST /api/contact`
- Contact retrieval: `GET /api/contacts`
- Static file serving for production builds

**Data Validation**
- Zod schemas defined in `/shared/schema.ts` for runtime validation
- Drizzle-Zod integration for database schema validation

**Development vs Production**
- Development: Vite dev server with middleware mode
- Production: Express serves static build from `/dist/public`
- ESBuild bundles server code with selective dependency bundling

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Drizzle ORM for type-safe database queries
- Schema location: `/shared/schema.ts`

**Database Schema**
- `users` table: Basic user authentication structure (id, username, password)
- `contacts` table: Contact form submissions (id, name, email, phone, message, createdAt)

**Migration Strategy**
- Drizzle Kit for schema migrations (output: `/migrations`)
- Push-based deployment with `npm run db:push`

**Temporary Storage**
- In-memory storage implementation (`MemStorage` class) for development/testing
- Maps used to store users and contacts without database dependency
- Production switches to database via `DATABASE_URL` environment variable

### External Dependencies

**Third-Party Services**
- **Cal.com**: Appointment booking widget embedded on `/book` page
- **Razorpay**: Payment gateway for session fees on `/payment` page
- **Instagram**: Social media integration (@therapy.w.himanshi)

**Payment Flow**
1. User navigates to `/payment` page
2. Razorpay checkout modal opens with ₹1,500 session fee
3. On success: Redirects to `/book` for appointment scheduling
4. On failure: Displays inline error message

**Booking Flow**
- Cal.com iframe embedded with customizable scheduling link
- All "Book Now" CTAs redirect to `/book` page

**Email/Notifications**
- Contact form submissions stored in database
- Email notification system prepared (SMTP configuration pending)

**Development Tools (Replit-specific)**
- `@replit/vite-plugin-runtime-error-modal`: Error overlay for development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development environment banner

**Asset Management**
- Custom meta images plugin updates OpenGraph tags for Replit deployments
- Static assets served from `/client/public` and `/attached_assets`