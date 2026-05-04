import React from 'react';
import './Sidebar.css'; 

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'home',      icon: 'bi-house-door',    label: 'Home' },
    { id: 'tasks',     icon: 'bi-check2-square', label: 'Tasks' },
    { id: 'notes',     icon: 'bi-journal-text',  label: 'Notes' },
    { id: 'analytics', icon: 'bi-bar-chart',     label: 'Analytics' },
    { id: 'settings',  icon: 'bi-gear',          label: 'Settings' },
  ];

  return (
    <div className="sidebar d-flex flex-column p-4">
      <div className="logo-text fw-bold mb-5">Taskflow</div>

      <div className="d-flex flex-column gap-2 mb-4">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`custom-nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <i className={`bi ${item.icon} me-2`}></i> {item.label}
          </button>
        ))}
      </div>

      {/* Decorative Sticky Note */}
      <div className="sidebar-sticky-note mt-4">
        <div className="metallic-pin-small"></div>
        <p>Small steps<br/>every day<br/>lead to big<br/>changes.</p>
        <div className="heart-doodle"><i className="bi bi-heart"></i></div>
      </div>

      {/* User Profile Pill */}
      <div className="user-profile-pill mt-auto" onClick={onLogout} title="Click to logout">
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.name ? user.name.split(' ')[0] : 'User'}</div>
          <div className="user-status">Stay productive!</div>
        </div>
        <i className="bi bi-chevron-down ms-auto text-muted" style={{fontSize: '0.8rem'}}></i>
      </div>
    </div>
  );
}