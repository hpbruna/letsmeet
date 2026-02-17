# Deploy to Vercel - Step by Step Guide

## 🚀 Method 1: Deploy via Vercel CLI (Fastest - 2 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate (it will open your browser).

### Step 3: Deploy
```bash
vercel
```

When prompted:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (No)
- **Project name?** → `letsmeet` (or your preferred name)
- **Directory?** → Press Enter (current directory)
- **Override settings?** → `N` (No)

### Step 4: Add Environment Variables
After deployment, you need to add your Supabase credentials:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
```
Paste: `https://lyjankhyavyrteqjbamc.supabase.co`

```bash
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Paste your Supabase anon key from .env.local

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

✅ **Done!** Your app will be live at the URL Vercel provides (e.g., `letsmeet.vercel.app`)

---

## 🌐 Method 2: Deploy via GitHub + Vercel Dashboard (Recommended)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `letsmeet`
3. Keep it Public or Private (your choice)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Push Code to GitHub

Copy and run these commands from your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/letsmeet.git

# Push to GitHub
git push -u origin main
```

If you get an error about branch name, try:
```bash
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Click "Continue with GitHub"
   - Authorize Vercel if needed
   - Select your `letsmeet` repository
4. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
5. **Add Environment Variables:**
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://lyjankhyavyrteqjbamc.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from `.env.local` |

6. Click **"Deploy"**

⏱️ **Wait 1-2 minutes** for the build to complete.

✅ **Done!** You'll get a live URL like: `https://letsmeet-abc123.vercel.app`

---

## 📋 Post-Deployment Checklist

After deployment, test your app:

1. ✅ Visit your Vercel URL
2. ✅ Create a new event
3. ✅ Add your availability
4. ✅ Verify the heatmap shows up
5. ✅ Test the share link
6. ✅ Test on mobile device

---

## 🔧 Troubleshooting

### Build Failed
- Check Vercel build logs for errors
- Verify environment variables are set correctly
- Make sure you're using Node.js 18+

### "Event not found" or Database Errors
- Verify environment variables in Vercel dashboard
- Check that Supabase project is running (not paused)
- Verify the anon key is correct (not the service_role key)

### Environment Variables Not Working
- In Vercel dashboard: Settings → Environment Variables
- Make sure variables are set for "Production"
- Redeploy after adding variables

---

## 🎉 You're Live!

Once deployed:
- Share your Vercel URL with users
- Each event gets a unique URL like: `yourapp.vercel.app/event/abc12345`
- No authentication required - just share and coordinate!

### Custom Domain (Optional)
1. In Vercel: Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🔄 Future Updates

To deploy updates:

**With GitHub:**
```bash
git add .
git commit -m "Your update message"
git push
```
Vercel will auto-deploy!

**With CLI:**
```bash
vercel --prod
```

---

Need help? Check Vercel logs or Supabase dashboard for errors.
