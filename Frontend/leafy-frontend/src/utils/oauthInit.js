/**
 * OAuth Initialization Utilities
 */

/**
 * Initialize Facebook SDK
 * Call this in your App or main component useEffect
 */
export const initializeFacebookSDK = (appId) => {
  if (!appId) {
    console.warn('Facebook App ID not configured');
    return;
  }

  // Check if FB SDK is already loaded
  if (window.FB) {
    FB.init({
      appId,
      xfbml: true,
      version: 'v18.0',
    });
    return;
  }

  // Load Facebook SDK
  window.fbAsyncInit = function () {
    FB.init({
      appId,
      xfbml: true,
      version: 'v18.0',
    });
  };

  // Load the Facebook SDK script
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js';
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  document.body.appendChild(script);
};
