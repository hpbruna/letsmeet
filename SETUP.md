# Setup Guide for LetsMeet

## Quick Start (5 minutes)

### Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - Project name: `letsmeet`
   - Database password: (generate a strong password)
   - Region: (choose closest to you)
4. Wait for the project to be created (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" or press Cmd/Ctrl + Enter
5. You should see "Success. No rows returned"

### Step 3: Get API Credentials

1. In Supabase, go to **Settings** > **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with what you copied from Supabase.

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see the landing page!

### Step 6: Test the Application

1. Click "Create New Event"
2. Fill in:
   - Title: "Team Meeting"
   - Date range: Tomorrow to next week
   - Time: 9:00 AM to 5:00 PM
3. Click "Create Event"
4. You'll be redirected to your event page
5. Click "Add Your Availability"
6. Enter your name and select some time slots
7. Click "Save Availability"
8. You should see the heatmap update!

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Vercel will auto-detect Next.js settings
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click "Deploy"
8. Done! Your app will be live in ~2 minutes

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add your environment variables when asked.

## Troubleshooting

### "Failed to create event"
- Check that your `.env.local` file exists and has the correct values
- Verify the Supabase migration ran successfully
- Check the browser console for errors

### "Event not found" (404 page)
- Make sure the event was created successfully
- Check the URL slug is correct
- Verify the database has data: Go to Supabase > Table Editor > events

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and `node_modules`, then run `npm install` again
- Check that you're using Node.js 18 or higher: `node --version`

### Database connection errors
- Verify your Supabase project is running (not paused)
- Check that environment variables are set correctly
- Make sure you're using the `anon` key, not the `service_role` key

## Database Management

### View Data
Go to Supabase > Table Editor to see your data:
- **events**: All created events
- **participants**: All participants
- **availability_slots**: All time slot selections

### Reset Database
If you want to start fresh:
1. Go to SQL Editor
2. Run:
```sql
TRUNCATE events CASCADE;
```
This will delete all events and related data.

## Production Checklist

Before launching:
- [ ] Test on mobile devices
- [ ] Test event creation flow
- [ ] Test participant submission
- [ ] Verify heatmap displays correctly
- [ ] Test share link functionality
- [ ] Check that environment variables are set in Vercel
- [ ] Test with multiple participants
- [ ] Verify 404 page works for invalid slugs

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the Vercel deployment logs
3. Verify Supabase is working in the dashboard
4. Review the README.md for additional information

## Next Steps

Once deployed, you can:
- Share the main URL with users to create events
- Each event gets a unique shareable URL
- No authentication required - just share and go!
