# Quick Start - Fix "Group Availability Not Visible"

## The Issue
If you're seeing the page but the Group Availability grid is empty or not showing, it's because the Supabase database tables haven't been created yet.

## Fix: Set Up Database (2 minutes)

### Step 1: Go to Supabase SQL Editor
1. Open your Supabase project at https://supabase.com/dashboard
2. Click on your project: `lyjankhyavyrteqjbamc`
3. On the left sidebar, click **SQL Editor**

### Step 2: Run the Migration
1. Click "New Query"
2. Copy **ALL** the SQL below:

```sql
-- Create events table
CREATE TABLE IF NOT EXISTS events (
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

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, name)
);

CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);

-- Create availability_slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  slot_start TIMESTAMP WITH TIME ZONE NOT NULL,
  slot_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_participant_slot UNIQUE(participant_id, slot_start)
);

CREATE INDEX IF NOT EXISTS idx_availability_event_id ON availability_slots(event_id);
CREATE INDEX IF NOT EXISTS idx_availability_participant_id ON availability_slots(participant_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON events FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON participants FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON availability_slots FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON availability_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON availability_slots FOR DELETE USING (true);
```

3. Click **Run** (or press Cmd/Ctrl + Enter)
4. You should see: ✅ "Success. No rows returned"

### Step 3: Verify Tables Were Created
1. In Supabase, click **Table Editor** (left sidebar)
2. You should see 3 new tables:
   - ✅ events
   - ✅ participants
   - ✅ availability_slots

### Step 4: Restart Dev Server
```bash
# Stop the current server (Ctrl + C)
# Then restart:
npm run dev
```

### Step 5: Test the App
1. Go to http://localhost:3000
2. Click "Create New Event"
3. Fill in:
   - Title: "Test Meeting"
   - Start Date: Today
   - End Date: Tomorrow
   - Start Time: 09:00
   - End Time: 17:00
4. Click "Create Event"
5. You should now see the **Group Availability** grid with time slots!

## Verify It's Working

On the event page, you should see:
- ✅ Event title and details at the top
- ✅ "Group Availability" heading
- ✅ A grid with dates across the top and times down the left
- ✅ "Add Your Availability" button
- ✅ Participant list on the right (empty at first)

## Still Having Issues?

Check browser console (F12) for any error messages and look for the debug logs showing:
- Number of time slots generated
- Event dates and times

The most common issues are:
1. Database tables not created → Run the SQL migration above
2. Wrong date format → Make sure you're selecting valid dates
3. Environment variables not set → Check .env.local has your Supabase credentials
