# SHURUQ ENTERPRISE
## Brand Discovery & Client Onboarding Platform
### Production Deployment & Gmail SMTP Integration Guide

This guide outlines the complete setup, configuration, and verification procedure for deploying the **SHURUQ Enterprise Brand Discovery Platform** to Vercel with **Nodemailer** and **Gmail SMTP**.

---

## 1. Architectural Overview

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons (bundled with Vite).
- **Backend API:** Vercel Serverless Function at `/api/submit` (handled via Node.js).
- **Email Protocol:** Direct TLS-secured connection to Gmail SMTP (`smtp.gmail.com:465`).
- **Official Recipient:** `shuruqenterprise@gmail.com`
- **Security:** Strict HTML escaping, URL sanitization, server-side official package pricing enforcement, honeypot spam protection, sliding-window rate limiting, and duplicate submission prevention.

---

## 2. Generating a Google App Password for Gmail SMTP

Google accounts require a dedicated **16-character App Password** for secure SMTP connections. Your standard account login password **will be rejected** by Gmail SMTP (`EAUTH 535-5.7.8`).

Follow these exact steps:

1. **Sign in to Google Account:**
   - Log into [shuruqenterprise@gmail.com](https://myaccount.google.com).
2. **Enable 2-Step Verification:**
   - Navigate to the **Security** tab (`https://myaccount.google.com/security`).
   - Under *"How you sign in to Google"*, ensure **2-Step Verification** is turned **ON**. (Google requires 2-Step Verification before App Passwords can be generated).
3. **Generate App Password:**
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Enter an App name (e.g., `SHURUQ Vercel Platform` or `Discovery Form`).
   - Click **Create**.
4. **Copy the 16-Character Password:**
   - Google displays a 16-letter code (e.g., `abcd efgh ijkl mnop`).
   - Copy this string immediately (you do not need to include spaces).
   - Store it securely in your password manager.

---

## 3. Environment Variables Configuration

The application requires exactly these environment variables:

| Variable | Recommended Value | Notes |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` | Official Google SMTP server |
| `SMTP_PORT` | `465` | SSL/TLS Secure Port |
| `SMTP_USER` | `shuruqenterprise@gmail.com` | Authenticating Gmail address |
| `SMTP_PASS` | `YOUR_16_CHAR_APP_PASSWORD` | Generated Google App Password (never share or commit) |
| `EMAIL_TO` | `shuruqenterprise@gmail.com` | Destination inbox for discovery submissions |

### Local Development Setup:
1. Create a `.env.local` file in the root directory:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=shuruqenterprise@gmail.com
   SMTP_PASS=your_16_character_app_password
   EMAIL_TO=shuruqenterprise@gmail.com
   ```
2. Verify that `.env` and `.env.local` are listed in `.gitignore` (already configured).

---

## 4. Testing SMTP Locally

To verify your Gmail SMTP credentials and outbound connectivity before deploying:

```bash
# Run the built-in diagnostic test
npm run test:smtp
```

**Expected output upon success:**
```text
================================================================
SHURUQ ENTERPRISE - GMAIL SMTP VERIFICATION TEST
================================================================
Host:      smtp.gmail.com
Port:      465 (Secure: true)
User:      shuruqenterprise@gmail.com
Recipient: shuruqenterprise@gmail.com
Password:  ***Configured (16 chars)***
----------------------------------------------------------------
Verifying SMTP connection and authentication with smtp.gmail.com:465...
✅ Connection verification SUCCESSFUL: true
Your Gmail SMTP configuration is 100% verified and ready for production!
```

---

## 5. Local Development Server

Run the development server using:

```bash
npm run dev
```

- **URL:** `http://localhost:5173`
- **Features:** 
  - Starts Vite instantly with zero port conflicts.
  - Built-in Vite middleware automatically intercepts `/api/submit` and runs the exact serverless submission handler.
  - Changes to frontend components and backend handler auto-reload seamlessly.

---

## 6. Deploying to Vercel

### Step 1: Push Code to GitHub
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SHURUQ Enterprise onboarding platform with Gmail SMTP"
   ```
2. Create a repository on GitHub (e.g. `shuruq-enterprise-onboarding`) and push your code:
   ```bash
   git remote add origin https://github.com/Abdubranddesigner/shuruq-enterprise-onboarding.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** &rarr; **Project**.
3. Select your `shuruq-enterprise-onboarding` repository from GitHub.
4. Framework Preset will automatically detect **Vite**.
5. Root Directory: `./` (leave default).

### Step 3: Configure Environment Variables in Vercel
Before clicking Deploy, expand the **Environment Variables** section and add:

- `SMTP_HOST` = `smtp.gmail.com`
- `SMTP_PORT` = `465`
- `SMTP_USER` = `shuruqenterprise@gmail.com`
- `SMTP_PASS` = `[YOUR_APP_PASSWORD_WITHOUT_SPACES]`
- `EMAIL_TO` = `shuruqenterprise@gmail.com`

*Ensure these are assigned to all environments: Production, Preview, and Development.*

### Step 4: Deploy
1. Click **Deploy**.
2. Once the build finishes, Vercel provides your live production domain (e.g., `https://shuruq-enterprise-onboarding.vercel.app`).

---

## 7. Testing a Live Production Submission

1. Visit your live Vercel URL.
2. Complete the form:
   - Client Name: `Test Client`
   - Business Name: `Test Enterprise`
   - WhatsApp Number: `+251 911 223 344`
   - Selected Package: `PRO` (35,000 ETB)
   - Fill in answers for Sections A, B, C, and D.
3. Click **Submit Questionnaire**.
4. The button displays `Sending via Gmail SMTP...` with a spinner.
5. Upon successful acceptance by Google's SMTP servers, the **Success Screen** appears with a unique `SHQ-...` Reference ID.
6. Check [shuruqenterprise@gmail.com](https://mail.google.com):
   - Subject: `New Brand Discovery Submission | Test Enterprise | SHURUQ Enterprise`
   - Design: Responsive black-and-gold visual identity with all answers and direct WhatsApp links.

---

## 8. Troubleshooting Guide

### 1. `EAUTH 535-5.7.8 Username and Password not accepted`
- **Cause:** Using standard Gmail login password or 2-Step Verification is disabled.
- **Fix:** Visit `https://myaccount.google.com/apppasswords` and generate a dedicated 16-character App Password. Ensure spaces are removed.

### 2. `ETIMEDOUT` or `ESOCKET` (Connection Timeout)
- **Cause:** Network or hosting firewall blocking outbound traffic to port 465.
- **Fix:** In Vercel, port 465 TLS outbound connections to Google's mail servers are supported on Node runtime. If your regional ISP or corporate network blocks port 465, test on another network.

### 3. Vercel Function Logs Inspection
- In Vercel Dashboard, go to your project &rarr; **Logs**.
- Filter by `/api/submit` to inspect real-time serverless executions and error codes.
