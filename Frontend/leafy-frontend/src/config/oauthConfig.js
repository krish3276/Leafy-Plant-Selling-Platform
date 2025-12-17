/**
 * OAuth Configuration
 * 
 * Before deploying, you need to:
 * 1. Create a Google OAuth app at https://console.cloud.google.com/
 * 2. Create a Facebook app at https://developers.facebook.com/
 * 
 * Environment Variables to set:
 * - VITE_GOOGLE_CLIENT_ID: Your Google OAuth Client ID
 * - VITE_FACEBOOK_APP_ID: Your Facebook App ID
 */

export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
  },
};

/**
 * Initialize Facebook SDK
 * Add this to your main.jsx or index.html
 */
export const initializeFacebookSDK = () => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: oauthConfig.facebook.appId,
      xfbml: true,
      version: 'v18.0',
    });
  };

  // Load the Facebook SDK
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

/**
 * Initialize Google OAuth
 * Wrap your app with GoogleOAuthProvider from @react-oauth/google
 */
export const initializeGoogleOAuth = () => {
  return {
    clientId: oauthConfig.google.clientId,
  };
};
