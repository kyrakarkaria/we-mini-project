import React, { useMemo } from 'react';
import './Home.css';

export default function Home({
  user, getGreeting, // Destructure these from props
  time, formatTime, isRunning, setIsRunning, isStudy,
  resetTimer, setActiveTab, tasks = [], notes = [], todayFocus = 0,
  workTime = 25, breakTime = 5,
}) {
  // SVG Timer Math
  const circumference = 2 * Math.PI * 45;
  const totalTime  = isStudy ? workTime * 60 : breakTime * 60;
  const dashoffset = circumference * (1 - time / totalTime);

  const urgentTasks = useMemo(() =>
    tasks.filter(t => !t.isDone).slice(0, 4),
    [tasks]
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isDone).length;
  const recentNote = notes.length > 0 ? notes[0] : null;

  const formatFocus = s => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return '—';
  };

  return (
    <div className="home-view w-100 mx-auto" style={{ maxWidth: '1000px' }}> {/* Main container */}
      <div className="plant-overlay-top"></div>
      <div className="plant-overlay-bottom"></div>
      
      {/* ── GREETING SECTION ── */}
<div className="page-header" style={{ marginBottom: '2rem' }}>
  
  <h1 className="page-greeting mb-1" style={{
    fontFamily: 'var(--font-serif)', 
    fontSize: '2.2rem', // Slightly smaller to look better on one line
    lineHeight: '1.2'
  }}>
    {getGreeting()}, <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
  </h1>
  <p className="text-muted" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', margin: 0 }}>
    Let's make today productive.
  </p>
</div>
      
      <div className="home-dashboard-grid">
        {/* ROW 1, COL 1: TIMER */}
        <div className="timer-card paper-card">
          <h3 className="card-title">Focus Session</h3>
          <div className="timer-ring-wrap">
            <svg viewBox="0 0 100 100" className="timer-svg">
              <circle className="timer-track" cx="50" cy="50" r="45" />
              <circle className="timer-progress" cx="50" cy="50" r="45" 
                style={{ 
                  strokeDasharray: circumference, 
                  strokeDashoffset: dashoffset,
                  stroke: 'var(--accent-sage)', 
                  transition: 'stroke-dashoffset 1s linear' 
                }} 
              />
            </svg>
            <div className="timer-center">
              <span className="timer-digits">{formatTime(time)}</span>
              <span className="timer-subtitle text-muted mt-1" style={{fontSize: '0.75rem'}}>
  {isStudy ? 'Ready to focus?' : 'Ready for a break?'}
</span>
            </div>
          </div>
          <div className="timer-btns">
            <button className="btn-sage" onClick={() => setIsRunning(r => !r)}>
              <i className={`bi ${isRunning ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="btn-outline" onClick={resetTimer}>
              <i className="bi bi-arrow-clockwise me-1"></i> Reset
            </button>
          </div>
        </div>

        {/* ROW 1, COL 2: NOTEBOOK TASKS */}
        <div className="notebook-card" onClick={() => setActiveTab('tasks')}>
          <div className="washi-tape"></div>
          <div className="notebook-header">
            <h3 className="card-title notebook-title mb-0">Today's Tasks</h3>
            <span className="tasks-progress-badge">{completedTasks}/{totalTasks} done</span>
          </div>
          <ul className="notebook-lines">
            {urgentTasks.length === 0 ? <li className="notebook-line text-muted" style={{borderBottom:'none'}}>No tasks yet</li> : 
              urgentTasks.map(t => (
                <li key={t._id} className="notebook-line">
                  <div className={`faux-checkbox ${t.isDone ? 'checked' : ''}`}>
                    {t.isDone && <i className="bi bi-check2"></i>}
                  </div>
                  <span className={`task-title ${t.isDone ? 'done text-muted' : ''}`}>{t.title}</span>
                  {t.priority === 'high' && <span className="task-tag tag-high">High</span>}
                  {t.priority === 'medium' && <span className="task-tag tag-medium">Medium</span>}
                  <span className="task-date text-muted ms-auto">{new Date(t.createdAt || Date.now()).toLocaleDateString('en-US', {day: 'numeric', month: 'short'})}</span>
                </li>
            ))}
          </ul>
          <div className="notebook-footer mt-auto pt-3">
            <span className="view-all-link text-muted" style={{fontSize: '0.8rem'}}>View all tasks <i className="bi bi-arrow-right"></i></span>
          </div>
        </div>

        {/* ROW 1, COL 3: CORKBOARD NOTES */}
        <div className="corkboard-card" onClick={() => setActiveTab('notes')}>
          <h3 className="corkboard-title">Quick Note</h3>
          <div className="real-sticky-note">
            <div className="metallic-pin-small"></div>
            <h4 className="sticky-title">{recentNote ? recentNote.title : 'Remember:'}</h4>
            <div className="sticky-body">
              {recentNote ? recentNote.content : (
                <ul className="sticky-list">
                  <li>Focus</li>
                  <li>Consistency</li>
                  <li>Progress</li>
                </ul>
              )}
            </div>
            <div className="star-doodle"><i className="bi bi-star"></i></div>
          </div>
        </div>

        {/* ROW 2, COL 1: MUSIC */}
        <div className="music-card">
          <div className="music-container">
            <iframe
              src="https://widgets.commoninja.com/iframe/3586f4ce-cf4a-4332-aafd-dc3cb9614903"
              scrolling="no"
              title="Music Player"
              className="music-iframe"
            ></iframe>
          </div>
        </div>

        {/* ROW 2, COL 2 & 3: FOCUS STATS */}
        <div className="focus-card paper-card">
          <div>
            <h3 className="card-title mb-1">Today's Focus</h3>
            {todayFocus === 0 ? (
               <span className="text-muted" style={{ fontSize: '0.9rem' }}>No focus set yet.</span>
            ) : (
               <span className="focus-time-large">{formatFocus(todayFocus)}</span>
            )}
          </div>
          <span className="view-analytics-link text-muted" onClick={() => setActiveTab('analytics')} style={{fontSize: '0.8rem', cursor: 'pointer'}}>
            View analytics <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  );
}