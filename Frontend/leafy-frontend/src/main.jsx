import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { initializeFacebookSDK } from './utils/oauthInit'
import './index.css'
import App from './App.jsx'

const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || ''

// Initialize Facebook SDK
if (facebookAppId) {
  initializeFacebookSDK(facebookAppId)
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

