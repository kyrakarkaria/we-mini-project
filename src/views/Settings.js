import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

export default function Settings({
  workTime, setWorkTime,
  breakTime, setBreakTime,
  setTime, isStudy
}) {
  const { user, logout } = useAuth();

  const handleWorkChange = (val) => {
    const mins = Math.max(1, Math.min(120, parseInt(val) || 1));
    setWorkTime(mins);
    if (isStudy) setTime(mins * 60);
  };

  const handleBreakChange = (val) => {
    const mins = Math.max(1, Math.min(60, parseInt(val) || 1));
    setBreakTime(mins);
    if (!isStudy) setTime(mins * 60);
  };

  return (
    <div className="d-flex flex-column h-100">

      {/* ── HEADER ── */}
      <div className="mb-4">
        <h2 className="mb-0" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
          Settings
        </h2>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Manage your preferences.
        </p>
      </div>

      <div className="settings-dashboard">

        {/* ── LEFT: PROFILE ── */}
        <div className="d-flex flex-column gap-3">
          
          <div className="paper-card settings-profile-card">
            {/* Generated avatar from name initials */}
<div style={{
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'var(--bg-hover)',
  border: '2px solid var(--border-strong)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'var(--accent-sage)',
}}>
  {user?.name?.charAt(0).toUpperCase() || 'G'}
</div>
            <div>
              <p className="settings-profile-name">
                {user?.name || 'Guest'}
              </p>
              <p className="settings-profile-role">
                {user?.email || ''}
              </p>
            </div>
            <div className="settings-profile-badge">
              <i className="bi bi-patch-check-fill text-sage"></i>
              Active workspace
            </div>
            <button
              className="btn w-100 mt-2"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                padding: '0.5rem'
              }}
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Sign out
            </button>
          </div>
        </div>

        {/* ── RIGHT: TIMER SETTINGS ── */}
        <div className="d-flex flex-column gap-3">
          <div className="paper-card settings-card">
            <div className="settings-card-title">Pomodoro Timer</div>

            {/* Focus session */}
            <div className="preference-row">
              <div>
                <div className="preference-label">Focus session</div>
                <div className="preference-hint">Length of each work block</div>
              </div>
              <div className="timer-input-wrap">
                <button
                  className="stepper-btn"
                  onClick={() => handleWorkChange(workTime - 1)}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workTime}
                  onChange={e => handleWorkChange(e.target.value)}
                />
                <span>min</span>
                <button
                  className="stepper-btn"
                  onClick={() => handleWorkChange(workTime + 1)}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* Short break */}
            <div className="preference-row">
              <div>
                <div className="preference-label">Short break</div>
                <div className="preference-hint">Rest between focus sessions</div>
              </div>
              <div className="timer-input-wrap">
                <button
                  className="stepper-btn"
                  onClick={() => handleBreakChange(breakTime - 1)}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={breakTime}
                  onChange={e => handleBreakChange(e.target.value)}
                />
                <span>min</span>
                <button
                  className="stepper-btn"
                  onClick={() => handleBreakChange(breakTime + 1)}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* Visual preview */}
            <div style={{
              background: 'var(--bg-hover)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--text-main)' }}>
                  {String(workTime).padStart(2, '0')}:00
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Focus
                </div>
              </div>
              <div style={{ color: 'var(--border-strong)', fontSize: '1.2rem' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 500, fontFamily: 'var(--font-sans)', color: 'var(--accent-sage)' }}>
                  {String(breakTime).padStart(2, '0')}:00
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Break
                </div>
              </div>
            </div>

            <p className="settings-applied-note">
              <i className="bi bi-info-circle"></i>
              Changes apply immediately to the active timer.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}