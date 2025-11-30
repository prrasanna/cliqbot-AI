import React, { useState } from 'react';
import { Mail, ArrowRight, Lock, Chrome } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (method: 'google' | 'email', email?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        onLogin('email', email);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('google');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-large">C</div>
          <h2 className="login-title">Sign in to CliqAI</h2>
          <p className="login-subtitle">
            Or <a href="#">start your 14-day free trial</a>
          </p>
        </div>

        <div className="login-card">
          
          {/* Google Login */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="btn-google"
            >
              <Chrome size={18} color="#ef4444" />
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="divider">
            <span>Or continue with email</span>
          </div>

          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-icon-wrapper">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="login-options">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="remember-me"
                  type="checkbox"
                  style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="remember-me" style={{ color: '#111827' }}>Remember me</label>
              </div>

              <div>
                <a href="#">Forgot your password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-login"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;