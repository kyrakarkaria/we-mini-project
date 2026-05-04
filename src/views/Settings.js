import React from 'react';
import './Settings.css';

export default function Settings({ workTime, setWorkTime, breakTime, setBreakTime, setTime, isStudy }) {

  const handleWorkChange = (val) => {
    const mins = parseInt(val) || 1;
    setWorkTime(mins);
    if (isStudy) setTime(mins * 60);
  };

  const handleBreakChange = (val) => {
    const mins = parseInt(val) || 1;
    setBreakTime(mins);
    if (!isStudy) setTime(mins * 60);
  };

  return (
    <div className="d-flex flex-column h-100">
      
      <div className="mb-4">
        <h2 className="mb-0" style={{fontFamily: 'var(--font-serif)', color: 'var(--text-main)'}}>Settings</h2>
        <p className="text-muted" style={{fontSize: '0.85rem'}}>Manage your account and preferences.</p>
      </div>

      <div className="settings-dashboard">
        
        {/* COLUMN 1 */}
        <div className="settings-col-1">
          <div className="paper-card settings-card align-items-center text-center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200" alt="Profile" className="settings-profile-img" />
            <div>
              <div className="fw-bold" style={{fontSize: '1.2rem', color: 'var(--text-main)'}}>Kunsh</div>
              <div className="text-muted" style={{fontSize: '0.9rem'}}>Software Engineer</div>
            </div>
            <button className="btn-custom w-100 mt-2 py-2">Edit Profile</button>
            <button className="btn text-danger bg-danger-subtle w-100 border-0 fw-medium">Log Out</button>
          </div>

          <div className="paper-card settings-card">
            <h3 className="settings-card-title">Appearance</h3>
            <div>
              <div className="preference-label mb-2">Theme</div>
              <div className="d-flex gap-2">
                <div className="theme-circle active" style={{background: '#FAF7F2'}} title="Light Mode"></div>
                <div className="theme-circle" style={{background: '#2d2a26'}} title="Dark Mode"></div>
                <div className="theme-circle" style={{background: '#70846b'}} title="Sage Mode"></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="preference-label mb-2">Accent Color</div>
              <div className="d-flex gap-2">
                <div className="theme-circle active" style={{background: '#70846b'}}></div>
                <div className="theme-circle" style={{background: '#e8a598'}}></div>
                <div className="theme-circle" style={{background: '#f5b041'}}></div>
                <div className="theme-circle" style={{background: '#a397ec'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="settings-col-2">
          <div className="paper-card settings-card">
            <h3 className="settings-card-title">App Preferences</h3>
            
            <div className="preference-item flex-column align-items-start gap-1">
              <span className="preference-label">Timezone</span>
              <select className="form-select bg-white border-light text-muted w-100" style={{fontSize: '0.85rem'}}>
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT+00:00) London</option>
              </select>
            </div>

            <div className="preference-item mt-2">
              <span className="preference-label">Focus session length</span>
              <div className="preference-control d-flex align-items-center gap-1">
                <input type="number" min="1" max="120" value={workTime} onChange={(e) => handleWorkChange(e.target.value)} />
                <span className="text-muted" style={{fontSize: '0.8rem'}}>min</span>
              </div>
            </div>

            <div className="preference-item">
              <span className="preference-label">Short break length</span>
              <div className="preference-control d-flex align-items-center gap-1">
                <input type="number" min="1" max="60" value={breakTime} onChange={(e) => handleBreakChange(e.target.value)} />
                <span className="text-muted" style={{fontSize: '0.8rem'}}>min</span>
              </div>
            </div>
            
            <div className="preference-item">
              <span className="preference-label">Long break length</span>
              <div className="preference-control d-flex align-items-center gap-1">
                <input type="number" value="15" readOnly className="opacity-50" />
                <span className="text-muted" style={{fontSize: '0.8rem'}}>min</span>
              </div>
            </div>
            
            <div className="preference-item">
              <span className="preference-label">Auto-start breaks</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            
            <div className="preference-item">
              <span className="preference-label">Auto-start focus</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
              </div>
            </div>

            <p className="mt-2 mb-0 text-muted fst-italic" style={{fontSize: '0.75rem'}}>Changes apply immediately to the timer.</p>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="settings-col-3">
          <div className="paper-card settings-card">
            <h3 className="settings-card-title">Notifications</h3>
            
            <div className="preference-item">
              <span className="preference-label">Email Notifications</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            
            <div className="preference-item">
              <span className="preference-label">Push Notifications</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>
            
            <div className="preference-item">
              <span className="preference-label">Timer Alarm Sound</span>
              <div className="preference-control">
                <select className="form-select border-0 shadow-sm" style={{fontSize: '0.85rem'}}>
                  <option>Gentle Chime</option>
                  <option>Bell</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </div>

          <div className="paper-card settings-card">
            <h3 className="settings-card-title text-danger border-bottom-0 pb-0">Danger Zone</h3>
            <p className="text-muted" style={{fontSize: '0.85rem'}}>Permanently delete your account and all associated data.</p>
            <button className="btn btn-outline-danger fw-medium" style={{fontSize: '0.9rem'}}>Delete Account</button>
          </div>
        </div>

      </div>
    </div>
  );
}