// App.js - Refactored for clean headers
import React, { useState, useEffect, useMemo } from 'react';
import './pomodoro.css'; 
import { useAuth } from './context/AuthContext';
import Login from './views/Login';
import Home from './views/Home';
import Tasks from './views/Tasks';
import Analytics from './views/Analytics';
import Notes from './views/Notes';
import Settings from './views/Settings';
import Sidebar from './components/Sidebar';
import backgroundImage from './assets/bg.png';

export default function App() {
  const { user, loading, logout, authFetch } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRunning, setIsRunning]     = useState(false);
  const [isStudy, setIsStudy]         = useState(true);
  const [activeTab, setActiveTab]     = useState('home');
  const [workTime, setWorkTime]       = useState(25);
  const [breakTime, setBreakTime]     = useState(5);
  const [time, setTime]               = useState(25 * 60);
  const [tasks, setTasks]             = useState([]);
  const [notes, setNotes]             = useState([]);
  const [todayFocus, setTodayFocus]   = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Sync Data
  useEffect(() => {
    if (!user) { setTasks([]); setNotes([]); return; }
    authFetch('http://127.0.0.1:5001/api/tasks').then(r => r.json()).then(setTasks).catch(() => {});
    authFetch('http://127.0.0.1:5001/api/notes').then(r => r.json()).then(setNotes).catch(() => {});
  }, [user, authFetch]);

  // Sync Today's Focus
  useEffect(() => {
    if (!user) { setTodayFocus(0); return; }
    const todayStr = new Date().toISOString().split('T')[0];
    authFetch('http://127.0.0.1:5001/api/sessions')
      .then(r => r.json())
      .then(data => {
        const totalSecondsToday = data
          .filter(s => s.date === todayStr)
          .reduce((sum, s) => sum + (s.duration * 60), 0);
        setTodayFocus(totalSecondsToday);
      }).catch(() => {});
  }, [user, authFetch]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(p => p - 1);
        if (isStudy) setTodayFocus(f => f + 1);
      }, 1000);
    } else if (time <= 0) {
      if (isStudy) {
        authFetch('http://127.0.0.1:5001/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: new Date().toISOString().split('T')[0], duration: workTime })
        }).catch(() => {});
      }
      setIsStudy(s => !s);
      setTime(isStudy ? breakTime * 60 : workTime * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isStudy, workTime, breakTime, authFetch]);

  const resetTimer = () => setTime(isStudy ? workTime * 60 : breakTime * 60);
  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  
  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h >= 5  && h < 12) return 'Good morning';
    if (h >= 12 && h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <div className="loading-screen">Loading your workspace...</div>;
  if (!user) return <Login />;

  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="app-shell">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />

      <main className="page-content" style={{ 
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.7), rgba(250, 249, 246, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        
        {/* Floating Date/Time Stamp (Always Upper Right) */}
        <div className="global-date-stamp text-end text-muted">
            <div className="fw-medium"><i className="bi bi-clock me-2"></i>{dateStr}</div>
            <div>{timeStr}</div>
        </div>

        {/* ── ROUTING ── */}
        <div className="view-container">
            {activeTab === 'home' && (
            <Home
                user={user} getGreeting={getGreeting} // Pass greeting to Home
                time={time} formatTime={formatTime} isRunning={isRunning} setIsRunning={setIsRunning}
                isStudy={isStudy} resetTimer={resetTimer} setActiveTab={setActiveTab}
                tasks={tasks} notes={notes} todayFocus={todayFocus} workTime={workTime} breakTime={breakTime}
            />
            )}
            {activeTab === 'tasks'     && <Tasks tasks={tasks} setTasks={setTasks} authFetch={authFetch} />}
            {activeTab === 'notes'     && <Notes notes={notes} setNotes={setNotes} authFetch={authFetch} />}
            {activeTab === 'analytics' && <Analytics tasks={tasks} authFetch={authFetch} />}
            {activeTab === 'settings'  && <Settings workTime={workTime} setWorkTime={setWorkTime} breakTime={breakTime} setBreakTime={setBreakTime} setTime={setTime} isStudy={isStudy} />}
        </div>
      </main>
    </div>
  );
}