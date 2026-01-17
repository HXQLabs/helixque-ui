# Helixque UI

Helixque UI is a modern web application built with [Next.js 15](https://nextjs.org/), designed for managing professional connections, mentorships, and community events. It features a responsive dashboard, real-time video meetings, and an AI assistant.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Bundler**: Turbopack
-   **Styling**: Tailwind CSS
-   **UI Components**: Shadcn UI (Radix Primitives)
-   **Authentication**: NextAuth.js (LinkedIn Provider)
-   **State Management**: React Context & Hooks
-   **Package Manager**: pnpm
-   **Monorepo Tool**: Turborepo

## Prerequisites

Ensure you have the following installed:

-   **Node.js**: >= 20.0.0
-   **pnpm**: >= 9.0.0 (or the version specified in `package.json`)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd helixque-ui
```

### 2. Install dependencies

This project uses `pnpm` workspace. Install dependencies from the root directory:

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in `apps/web/.env` with the following variables:

```env
# Database / Redis (Upstash)
UPSTASH_REDIS_REST_URL="your_upstash_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

# Authentication (NextAuth.js)
AUTH_SECRET="your_generated_secret" # Generate with: openssl rand -base64 32
AUTH_LINKEDIN_ID="your_linkedin_client_id"
AUTH_LINKEDIN_SECRET="your_linkedin_client_secret"

# Backend
NEXT_PUBLIC_BACKEND_URI="http://localhost:4001" # URL of the User Backend Service
NEXT_PUBLIC_RTC_BACKEND_URI="http://localhost:5001" # URL of the RTC Backend Service
```

### 4. Running the Development Server

To start the development server for all apps (Web UI):

```bash
pnpm dev
```

This commands runs `turbo dev`. The web application will be available at:

-   **Web UI**: [http://localhost:3000](http://localhost:3000)

### 5. Building for Production

To build the application for production:

```bash
pnpm build
```

This runs `turbo build`, which caches build artifacts for faster subsequent builds.

## Project Structure

```
helixque-ui/
├── apps/
│   └── web/                 # Next.js Application (Dashboard, Meeting, Auth)
├── packages/
│   ├── ui/                  # Shared UI components (Shadcn)
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
├── package.json             # Root package.json (Scripts & Workspaces)
├── pnpm-workspace.yaml      # pnpm workspace definition
└── turbo.json               # Turborepo pipeline configuration
```

## Features

-   **Dashboard**: Comprehensive overview of stats, upcoming meetings, and community updates.
-   **Video Meetings**: Integrated WebRTC-based video calling with device checks.
-   **AI Assistant**: Chat interface for career advice and code reviews.
-   **Leaderboard**: Gamified community contribution tracking.
-   **Profile Management**: Edit profile, skills, and preferences.
-   **Theme Support**: Dark/Light mode toggle.

## Commands

-   `pnpm dev`: Start development server.
-   `pnpm build`: Build for production.
-   `pnpm lint`: Run ESLint across all packages.
-   `pnpm format`: Format code with Prettier.
