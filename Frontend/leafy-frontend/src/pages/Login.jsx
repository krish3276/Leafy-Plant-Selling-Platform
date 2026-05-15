import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Chrome, Facebook } from 'lucide-react';
import '../styles/Auth.css';

function Login() {
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

  const handleGoogleLogin = () => {
    alert('Google login coming soon!');
  };

  const handleFacebookLogin = () => {
    alert('Facebook login coming soon!');
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
            <button
              type="button"
              className="oauth-button google"
              onClick={handleGoogleLogin}
            >
              <Chrome size={20} />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="oauth-button facebook"
              onClick={handleFacebookLogin}
            >
              <Facebook size={20} />
              <span>Facebook</span>
            </button>
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
