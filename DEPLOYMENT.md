# Deployment Guide

## Architecture
- **Frontend**: Netlify (React app)
- **Backend**: Railway (Node.js + Express)
- **Database**: PostgreSQL (on Railway)

---

## Full Deployment Steps

### 1️⃣ Deploy Backend to Railway

#### a) Prepare GitHub Repository
```bash
cd /Users/kvenketesh/daily-notes
git init
git add .
git commit -m "Initial commit: Daily Notes with auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/daily-notes.git
git push -u origin main
```

#### b) Deploy on Railway
1. Go to **https://railway.app**
2. Sign up with GitHub (recommended)
3. Click **"New Project"** 
4. Select **"Deploy from GitHub repo"**
5. Choose your `daily-notes` repository
6. Railway will auto-detect Node.js backend
7. Add **PostgreSQL** plugin:
   - In Railway dashboard, click **"Add"**
   - Search **"PostgreSQL"**
   - Click **"Add PostgreSQL"**

#### c) Set Environment Variables in Railway
In your Railway project dashboard:
- Click **"Variables"** tab
- Add these variables:
  ```
  JWT_SECRET = (generate a random string like: your-secret-key-12345)
  NODE_ENV = production
  ```
- PostgreSQL plugin auto-fills `DATABASE_URL`

#### d) Get Your Backend URL
- In Railway dashboard, go to your Node.js service
- Click **"Settings"** → **"Domains"**
- Copy the domain: `https://your-project-xxxxx.railway.app`
- Your API endpoint is: `https://your-project-xxxxx.railway.app/api`

**Save this URL for Step 2!**

---

### 2️⃣ Deploy Frontend to Netlify

#### a) Update Frontend Configuration
Edit `frontend/netlify.toml`:
```toml
[env.production]
VITE_API_URL = "https://your-project-xxxxx.railway.app/api"
```
Replace with your actual Railway backend URL.

#### b) Deploy to Netlify
1. Go to **https://netlify.com**
2. Sign up with GitHub (recommended)
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repository: `your-username/daily-notes`
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-project-xxxxx.railway.app/api`
7. Click **"Deploy site"**

Netlify will automatically:
- Build your React app
- Deploy to CDN (worldwide)
- Give you a domain: `your-app.netlify.app`

---

### 3️⃣ Enable CORS on Backend

Your Railway backend needs CORS enabled for Netlify requests:

Edit `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.netlify.app'  // Add your Netlify URL
  ],
  credentials: true
}));
```

Then push to GitHub:
```bash
git add backend/src/index.ts
git commit -m "Add CORS for Netlify frontend"
git push
```

Railway will auto-redeploy! ✅

---

## 🎉 Done!

Your app is now live:
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-project-xxxxx.railway.app
- **Database**: PostgreSQL on Railway

### Test It:
1. Open your Netlify URL
2. Sign up with an email
3. Create notes → saves to PostgreSQL ✓
4. Refresh page → notes persist ✓
5. Log out and log in again → your notes are there ✓

---

## Troubleshooting

### "Connection refused" error?
- Check Railway backend is running (dashboard should show green status)
- Verify `VITE_API_URL` in Netlify matches your Railway URL

### CORS errors?
- Make sure you added your Netlify URL to CORS origins in backend
- Commit and push → Railway auto-redeploys

### "Invalid token" errors?
- Make sure `JWT_SECRET` is set in Railway (not empty!)
- Both backend and frontend must have same JWT_SECRET

---

## Cost

- **Railway**: FREE tier includes $5/month credit (enough for hobby projects)
- **Netlify**: FREE tier (unlimited sites, 300 build minutes/month)
- **Total**: FREE! ✨

To add domain name:
- Buy domain on Godaddy/Namecheap (~$12/year)
- Point to Railway backend and Netlify frontend
