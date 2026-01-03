# 🚀 Deployment Guide - RizzTech Portfolio

Deploy your company profile website for **FREE** using these services.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Vercel       │────▶│    Render       │────▶│   Supabase      │
│   (Frontend)    │     │   (Backend)     │     │  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Cloudinary    │
                        │ (Image Storage) │
                        └─────────────────┘
```

---

## Step 1: Create Supabase Database (Free)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings → Database**
4. Copy the **Connection string** (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

---

## Step 2: Create Cloudinary Account (Free)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Go to **Dashboard**
3. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 3: Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a **New Web Service**
4. Select your repo and navigate to `/server` folder
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run init-db && npm start`
6. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `DB_TYPE` | `postgres` |
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | Generate a random secret |
| `JWT_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name |
| `CLOUDINARY_API_KEY` | Your API key |
| `CLOUDINARY_API_SECRET` | Your API secret |

7. Click **Create Web Service**
8. Wait for deployment and copy your backend URL (e.g., `https://your-app.onrender.com`)

---

## Step 4: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |
| `VITE_SERVER_URL` | `https://your-backend.onrender.com` |

5. Click **Deploy**

---

## Step 5: Update CORS on Backend

After deploying, update your Render environment:

| Variable | Value |
|----------|-------|
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` |

---

## 🎉 Done!

Your portfolio is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`

> ⚠️ **Important**: Change the admin password after first login!

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| **Vercel** | Unlimited sites, 100GB bandwidth/month |
| **Render** | 750 hours/month (sleeps after 15 min inactivity) |
| **Supabase** | 500MB database, 2 projects |
| **Cloudinary** | 25GB storage, 25GB bandwidth/month |

---

## Troubleshooting

### Backend sleeps on Render?
Free tier apps sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

### Images not loading?
Make sure Cloudinary credentials are correct and CORS is configured.

### Database connection failed?
Check your Supabase connection string and make sure `?sslmode=require` is included.
