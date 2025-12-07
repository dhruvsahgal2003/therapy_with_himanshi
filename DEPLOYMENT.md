# Deploying to Vercel

## Step 1: Download the Project

1. In Replit, click the **three dots menu** (⋮) in the Files panel
2. Select **"Download as zip"**
3. Extract the zip file on your computer

## Step 2: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Open Terminal in the extracted folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Therapy with Himanshi"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the Vite framework
5. Add Environment Variables:
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay key
   - `VITE_CALCOM_BOOKING_LINK` = your Cal.com booking link
6. Click **Deploy**

## Environment Variables

Set these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay test/live key ID |
| `VITE_CALCOM_BOOKING_LINK` | Your Cal.com booking page URL |

## Cal.com Setup

1. Create an account at [cal.com](https://cal.com)
2. Set up your availability
3. Copy your booking link (e.g., `https://cal.com/himanshi`)
4. Update the iframe src in `/client/src/pages/Book.tsx`

## Razorpay Setup

1. Create an account at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard → Settings → API Keys
3. Use test keys for development, live keys for production

---

Your site will be live at `https://your-project.vercel.app`
