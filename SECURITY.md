# Security Checklist for Holiday Landing Page

## Environment Variables - CRITICAL
✅ `.env.local` is in `.gitignore` - your keys will NOT be committed to git
✅ All API calls are made from server-side API routes (not client-side)
✅ API keys are only accessible in Next.js API routes

## Before Deploying to Production

### 1. Vercel/Production Environment
- Add all environment variables in your hosting platform's dashboard
- NEVER commit `.env.local` to git
- When deploying to Vercel:
  1. Go to Project Settings → Environment Variables
  2. Add each variable from `.env.local`
  3. Mark them as "Production", "Preview", and "Development" as needed

### 2. Rotate Keys if Exposed
If you ever accidentally commit `.env.local`:
1. Immediately revoke the Google service account key
2. Create a new service account
3. Revoke and regenerate the Klaviyo API key
4. Update all environment variables in production

### 3. Git Safety
Run this command to ensure `.env.local` is never tracked:
```bash
git rm --cached .env.local 2>/dev/null || true
```

### 4. Additional Security Measures
- Enable rate limiting on your API routes (consider adding middleware)
- Monitor Klaviyo and Google Sheets for unusual activity
- Set up alerts for failed authentication attempts
- Consider adding CAPTCHA if you get bot spam

## Current Security Status
✅ All sensitive keys are in `.env.local`
✅ `.env.local` is in `.gitignore`
✅ `.env.local.example` contains no real keys
✅ API routes are server-side only
✅ No keys are exposed to the client

## What's Safe to Commit
✅ `.env.local.example` - template with no real values
✅ All code files (they reference process.env, not actual keys)
✅ Public assets (images, fonts, etc.)

## What Must NEVER Be Committed
❌ `.env.local` - contains real API keys
❌ Google service account JSON file
❌ Any file with actual credentials
