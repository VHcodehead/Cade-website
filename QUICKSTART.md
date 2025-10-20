# Quick Start Guide

## Step 1: Add Your Vimeo Video IDs

1. Open `index.html`
2. Find each line with `data-vimeo-id="123456789"`
3. Replace the numbers with your actual Vimeo video IDs
   - Go to your video on Vimeo: `vimeo.com/987654321`
   - Copy the ID (the numbers): `987654321`
   - Replace in HTML: `data-vimeo-id="987654321"`

## Step 2: Test Locally

```bash
# Install dependencies
npm install

# Run the server
npm start

# Open browser to http://localhost:3000
```

## Step 3: Deploy to Railway

### Option A: GitHub (Easiest)

1. Create a GitHub repository
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to [railway.app](https://railway.app)
4. Click "New Project" → "Deploy from GitHub"
5. Select your repo
6. Railway auto-deploys!

### Option B: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

## Step 4: Customize (Optional)

### Change Colors
Edit `styles.css`:
```css
:root {
    --accent: #ff4400;  /* Change this to your brand color */
}
```

### Change Company Name
Search and replace "VLACOVISION" in `index.html`

### Add More Videos
Copy a video block in `index.html` and paste it with your new video info

## Common Issues

**Videos not loading?**
- Make sure Vimeo IDs are correct
- Check that videos are set to "Public" or "Unlisted" on Vimeo
- Verify privacy settings allow embedding

**Website not loading on Railway?**
- Check Railway logs for errors
- Ensure `package.json` has correct start script
- Verify PORT environment variable is set

## Need Help?

Check the full `README.md` for detailed documentation.
