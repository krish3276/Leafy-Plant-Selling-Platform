import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import '../styles/Auth.css';

function Login() {
  useEffect(() => {
    // Load Google SDK
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://accounts.google.com/gsi/client';
    document.head.appendChild(script);

    // Initialize Google Sign-In after script loads
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSuccess,
        });

        // Render the Google Sign-In button
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer && window.google) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            width: 300,
          });
        }
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on role
        if (data.user?.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/account';
        }
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleGoogleSuccess = async (response) => {
    const token = response?.credential;
    if (!token) {
      console.error('No credential returned from Google');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('authToken', data.token || data.authToken || '');
          if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = '/';
          return;
        }
      }

      alert('Google login failed on the server.');
    } catch (err) {
      console.error('Google login error:', err);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Leafy account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="oauth-buttons">
            <div className="google-auth-button-wrap">
              <div id="google-signin-button"></div>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;
