# Holiday Landing Page Setup Instructions

## Prerequisites
- Node.js installed
- Google Cloud account
- Klaviyo account

## 1. Logo Setup
Place your `h-logo.png` file in the `/public` folder.

## 2. Google Sheets Setup

### Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Holiday Landing Responses" (or whatever you prefer)
4. Keep the default "Sheet1" tab (or note the tab name if different)
5. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

### Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
5. Create a key:
   - Click on your new service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose JSON format
   - Download the JSON file

### Share the Sheet
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Editor" permissions

## 3. Klaviyo Setup

### Get Your API Key
1. Log in to [Klaviyo](https://www.klaviyo.com)
2. Go to Settings > API Keys
3. Create a new Private API Key
4. Copy the key

### Get Your List ID
1. Go to Audience > Lists & Segments
2. Select or create the list you want to use
3. The List ID is in the URL: `https://www.klaviyo.com/list/LIST_ID`

## 4. Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id

KLAVIYO_PRIVATE_API_KEY=your-klaviyo-private-api-key
KLAVIYO_LIST_ID=your-klaviyo-list-id
```

**Important:** For `GOOGLE_PRIVATE_KEY`, copy the entire private key from the JSON file, including the BEGIN and END lines. Make sure it's wrapped in quotes.

## 5. Custom Font Setup

When you have your custom font file:
1. Place the font file in `/public/fonts/` (create the folder if needed)
2. Update `app/globals.css` to import and use the font
3. Apply the font class to the input fields in `app/page.tsx`

## 6. Run the Project

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 7. Deploy

The easiest way to deploy is with Vercel:

```bash
npm install -g vercel
vercel
```

Make sure to add all environment variables in your Vercel project settings.

## Testing

- Test the answer submission - check your Google Sheet for new rows
- Test the subscribe form - check Klaviyo for new subscribers
- Test duplicate subscription - try subscribing with the same email twice
