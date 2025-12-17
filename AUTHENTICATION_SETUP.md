# Authentication Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for the Leafy Plants platform.

## Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [Facebook OAuth Setup](#facebook-oauth-setup)
3. [Environment Variables](#environment-variables)
4. [Backend Integration](#backend-integration)
5. [Testing](#testing)

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "NEW PROJECT"
3. Enter a project name (e.g., "Leafy Plants")
4. Click "CREATE"

### Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and select "ENABLE"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" and select "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - Fill in the required information
   - Add required scopes: email, profile, openid
4. For Application type, select "Web application"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain
6. Add Authorized redirect URIs:
   - `http://localhost:5173/callback` (for development)
   - Your production callback URL
7. Click "CREATE"
8. Copy your **Client ID** (you'll need this)

### Step 4: Add Google OAuth to Frontend

The frontend already includes Google authentication. Just ensure the dependencies are installed:

```bash
npm install @react-oauth/google
```

---

## Facebook OAuth Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details and create the app

### Step 2: Add Facebook Login

1. In your app dashboard, click "+ Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" as your platform
4. Go to "Settings" > "Basic" to find your **App ID**

### Step 3: Configure App Domains

1. In App Settings > "Basic", add your domains:
   - `localhost:5173` (for development)
   - `localhost:3000` (if using different port)
   - Your production domain

### Step 4: Configure OAuth Redirect URIs

1. Go to "Facebook Login" > "Settings"
2. Add Valid OAuth Redirect URIs:
   - `http://localhost:5173/` (for development)
   - Your production URL

---

## Environment Variables

Create a `.env.local` file in the `Frontend/leafy-frontend/` directory:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Facebook OAuth
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here

# Backend API
VITE_API_URL=http://localhost:5000
```

**Important:** Never commit `.env.local` to version control. Add it to `.gitignore`.

### Where to get these values:

- **VITE_GOOGLE_CLIENT_ID**: From Google Cloud Console > Credentials
- **VITE_FACEBOOK_APP_ID**: From Facebook App Dashboard > Settings > Basic

---

## Backend Integration

### Setting up the Login Endpoint

Your backend should have these endpoints:

#### 1. Traditional Login
```
POST /api/login
Body: { email, password }
Response: { token, user: { id, firstName, lastName, email } }
```

#### 2. Google Login
```
POST /api/login/google
Body: { token }
Response: { token, user: { id, firstName, lastName, email } }
```

#### 3. Facebook Login
```
POST /api/login/facebook
Body: { accessToken }
Response: { token, user: { id, firstName, lastName, email } }
```

#### 4. Sign Up
```
POST /api/signup
Body: { firstName, lastName, email, phone, password }
Response: { token, user: { id, firstName, lastName, email } }
```

#### 5. Google Sign Up
```
POST /api/signup/google
Body: { token }
Response: { token, user: { id, firstName, lastName, email } }
```

#### 6. Facebook Sign Up
```
POST /api/signup/facebook
Body: { accessToken }
Response: { token, user: { id, firstName, lastName, email } }
```

### Backend Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
app.post('/api/login/google', async (req, res) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Find or create user in database
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        googleId: payload.sub,
      });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: 'Google login failed' });
  }
});

// Facebook Login
app.post('/api/login/facebook', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${req.body.accessToken}`
    );
    
    const facebookData = response.data;
    
    // Find or create user in database
    let user = await User.findOne({ email: facebookData.email });
    if (!user) {
      const [firstName, lastName] = facebookData.name.split(' ');
      user = await User.create({
        firstName,
        lastName: lastName || '',
        email: facebookData.email,
        facebookId: facebookData.id,
      });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: 'Facebook login failed' });
  }
});
```

---

## Testing

### Test Locally

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Start the development server:
```bash
npm run dev
```

4. Click the user icon in the navbar to access login/signup

### Test OAuth Flows

1. **Email/Password Login**: Use any test email and password
2. **Google Login**: You'll see a Google popup to sign in
3. **Facebook Login**: You'll see a Facebook popup to sign in

---

## Troubleshooting

### "Popup blocked" error
- Allow popups for your localhost in browser settings
- Some browsers require user interaction before popups

### "Invalid client ID" error
- Verify your `VITE_GOOGLE_CLIENT_ID` is correct in `.env.local`
- Check that your app domain is added to Google Cloud Console

### "App not set up" error (Facebook)
- Ensure your app is in development or live mode
- Check that your domain is added to app settings

### CORS errors
- Ensure your backend API supports CORS
- Add proper CORS headers for OAuth endpoints

---

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use HTTPS in production** - OAuth requires secure connections
3. **Store tokens securely** - Consider using HTTP-only cookies instead of localStorage
4. **Validate tokens on backend** - Always verify tokens server-side
5. **Keep dependencies updated** - Regularly update OAuth libraries
6. **Rate limit login attempts** - Prevent brute force attacks
7. **Use strong JWT secrets** - At least 32 characters

---

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [react-oauth/google](https://github.com/react-oauth/react-oauth-google)
- [JWT.io](https://jwt.io/) - Learn about JWTs

---

## Support

If you encounter issues, please check:
1. Console errors in browser DevTools
2. Network tab to see API responses
3. Backend logs for server-side errors
4. This documentation for common issues
