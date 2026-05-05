import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    try {
      const res  = await fetch(`http://127.0.0.1:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong'); return; }
      login(data.token, data.user);
    } catch {
      setError('Cannot reach server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── LEFT: DECORATIVE PANEL ── */}
      <div className="login-left">
        <div className="login-left-inner">
          <span className="login-brand-left">Taskflow</span>

          <div className="login-divider">
        
          </div>

          <p className="login-quote">
            "The secret of getting ahead is getting started."
          </p>
          <p className="login-quote-author">— Mark Twain</p>
        </div>
      </div>

      {/* ── RIGHT: FORM ── */}
      <div className="login-right">
        <div className="login-box">

          <span className="login-brand">Taskflow</span>

          <h2 className="login-title">
            {isSignup ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="login-sub">
            {isSignup ? 'Start your productive workspace.' : 'Sign in to continue your work.'}
          </p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={submit} className="login-form">
            {isSignup && (
              <div className="lf-field">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handle}
                  required
                />
              </div>
            )}

            <div className="lf-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
              />
            </div>

            <div className="lf-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
                minLength={6}
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className="login-toggle">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => { setIsSignup(s => !s); setError(''); }}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </span>
          </p>

          <p className="login-note">
            Made by Kyra Karkaria & Kunsh Kaul
          </p>

        </div>
      </div>

    </div>
  );
}