# LetsMeet - When2meet Clone

A modern scheduling coordination tool built with Next.js 15, Supabase, and Tailwind CSS. Find the perfect time for your group meetings without requiring authentication.

## Features

- 📅 **Easy Event Creation** - Set date ranges and time slots in 15-minute intervals
- 👥 **Anonymous Participation** - No sign-up required, just add your name
- 🎨 **Interactive Grid** - Drag-to-select availability on desktop and mobile
- 🔥 **Heatmap Visualization** - See at a glance when most people are available
- 🔗 **Shareable Links** - Each event gets a unique URL to share
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- npm or yarn package manager

### 1. Clone and Install

```bash
cd letsmeet
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the database migrations:

```sql
-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(12) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);

-- Create participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, name)
);

CREATE INDEX idx_participants_event_id ON participants(event_id);

-- Create availability_slots table
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  slot_start TIMESTAMP WITH TIME ZONE NOT NULL,
  slot_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_participant_slot UNIQUE(participant_id, slot_start)
);

CREATE INDEX idx_availability_event_id ON availability_slots(event_id);
CREATE INDEX idx_availability_participant_id ON availability_slots(participant_id);
```

3. Get your API credentials from Settings > API
4. Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
letsmeet/
├── app/                      # Next.js app router
│   ├── api/                  # API routes
│   ├── create/               # Event creation page
│   ├── event/[slug]/         # Dynamic event page
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── event/                # Event-related components
│   └── create/               # Creation form components
├── lib/
│   ├── supabase/             # Database clients
│   ├── utils/                # Utility functions
│   └── hooks/                # Custom React hooks
└── types/                    # TypeScript types
```

## Key Components

- **AvailabilityGrid** - Interactive time slot selector with drag-to-select
- **HeatmapGrid** - Visualization of group availability
- **ParticipantModal** - Dialog for adding availability
- **CreateEventForm** - Event creation with validation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Environment Variables

Make sure to set these in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Usage

### Creating an Event

1. Click "Create New Event"
2. Fill in event details (title, date range, time range)
3. Click "Create Event"
4. Share the generated link with participants

### Adding Availability

1. Open the event link
2. Click "Add Your Availability"
3. Enter your name
4. Select available time slots by clicking/dragging
5. Click "Save Availability"

### Viewing Results

The heatmap shows availability at a glance:
- Darker green = more people available
- Hover over cells to see who's available
- Participant list shows all who've submitted

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
