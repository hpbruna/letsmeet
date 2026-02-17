# Push to GitHub

Your GitHub repo: https://github.com/hpbruna/letsmeet

## Option 1: Using GitHub CLI (Easiest)

If you have GitHub CLI installed:
```bash
gh auth login
git push -u origin main
```

## Option 2: Using Personal Access Token

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (all checkboxes under repo)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push with token:**
   ```bash
   git push -u origin main
   ```
   - Username: `hpbruna`
   - Password: Paste your token

## Option 3: Using SSH (Recommended for future)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter for default location
   # Set a passphrase or press Enter for none
   ```

2. **Add SSH key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   - Copy the output
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key

3. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:hpbruna/letsmeet.git
   git push -u origin main
   ```

## Quick Command (Choose based on your setup)

```bash
# If you use GitHub Desktop or have credentials cached:
git push -u origin main

# If prompted, enter your GitHub username and password (or token)
```

## After Successful Push

You should see:
```
Enumerating objects: ...
Counting objects: ...
Writing objects: 100%
```

Then go to: https://github.com/hpbruna/letsmeet
You should see all your files!

## Next: Deploy to Vercel

Once pushed, go to: https://vercel.com/new
And import your repository!
