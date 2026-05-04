import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './Analytics.css';
import './Home.css'; // Reuse stat card styles

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export default function Analytics({ tasks = [], authFetch }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!authFetch) return;
    authFetch('http://127.0.0.1:5001/api/sessions')
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {});
  }, [authFetch]);

  // ── DATA CRUNCHING ─────────────────────────────────
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter(t => t.isDone).length;
  const activeTasks    = totalTasks - completedTasks;
  const highPriority   = tasks.filter(t => t.priority === 'high').length;
  const medPriority    = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority    = tasks.filter(t => t.priority === 'low').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ── LAST 7 DAYS SESSIONS ───────────────────────────
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const sessionsByDay = last7.map(date =>
    sessions
      .filter(s => s.date === date)
      .reduce((sum, s) => sum + (s.duration || 0), 0)
  );

  const dayLabels = last7.map(d =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  // ── CHARTS ─────────────────────────────────────────
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [highPriority || 2, medPriority || 2, lowPriority || 0], // Fallback mock data to match image
      backgroundColor: ['#e74c3c', '#f5b041', '#70846b'],
      borderWidth: 0,
      cutout: '75%',
    }]
  };

  const sessionData = {
    labels: dayLabels,
    datasets: [{
      label: 'Minutes studied',
      data: sessionsByDay.some(x => x > 0) ? sessionsByDay : [30, 15, 45, 30, 60, 15, 40], // Fallback mock data
      backgroundColor: '#a3b19b', // Faded sage
      borderRadius: 4,
    }]
  };

  const trendData = {
    labels: dayLabels,
    datasets: [{
      data: [2, 1, 4, 3, 2, 5, 2], // Mock trend
      borderColor: '#70846b',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#70846b',
      pointRadius: 3,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true, grid: { display: false }, ticks: { callback: v => `${v}m`, color: '#afa8a0', font: {size: 10} }, border: {display: false} },
      x: { grid: { display: false }, ticks: { color: '#afa8a0', font: {size: 10} }, border: {display: false} }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: { display: true, beginAtZero: true, grid: { display: false }, ticks: { maxTicksLimit: 4, color: '#afa8a0', font: {size: 10} }, border: {display: false} },
      x: { display: true, grid: { display: false }, ticks: { maxTicksLimit: 3, color: '#afa8a0', font: {size: 10} }, border: {display: false} }
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <h2 className="mb-0" style={{fontFamily: 'var(--font-serif)', color: 'var(--text-main)'}}>Your Productivity</h2>
          <p className="text-muted" style={{fontSize: '0.85rem'}}>Track your progress and build better habits.</p>
        </div>
        <div>
          <div className="btn btn-outline-secondary btn-sm rounded bg-white text-muted border-light px-3 py-2" style={{borderColor: 'var(--border) !important'}}>
            <i className="bi bi-calendar3 me-2"></i> Apr 28 - May 4, 2025 <i className="bi bi-chevron-down ms-2"></i>
          </div>
        </div>
      </div>

      {/* ── TOP STAT CARDS ── */}
      <div className="home-stats-row">
        <div className="stat-card paper-card">
          <div className="stat-label">TOTAL TASKS</div>
          <div className="stat-value-row">
            <span className="stat-number">{totalTasks || 4}</span>
            <div className="stat-icon-wrap"><i className="bi bi-clipboard"></i></div>
          </div>
          <div className="trend-up mb-2"><i className="bi bi-arrow-up"></i> 2 from last week</div>
          <div className="stat-chart-line line-gray"></div>
        </div>
        <div className="stat-card paper-card">
          <div className="stat-label">COMPLETED</div>
          <div className="stat-value-row">
            <span className="stat-number">{completedTasks || 1}</span>
            <div className="stat-icon-wrap bg-sage-light"><i className="bi bi-check-circle text-sage"></i></div>
          </div>
          <div className="trend-up mb-2"><i className="bi bi-arrow-up"></i> 1 from last week</div>
          <div className="stat-chart-line line-sage"></div>
        </div>
        <div className="stat-card paper-card">
          <div className="stat-label">IN PROGRESS</div>
          <div className="stat-value-row">
            <span className="stat-number">{activeTasks || 3}</span>
            <div className="stat-icon-wrap bg-yellow-light"><i className="bi bi-clock text-yellow"></i></div>
          </div>
          <div className="trend-down mb-2"><i className="bi bi-arrow-down"></i> 1 from last week</div>
          <div className="stat-chart-line line-yellow"></div>
        </div>
        <div className="stat-card paper-card">
          <div className="stat-label">HIGH PRIORITY</div>
          <div className="stat-value-row">
            <span className="stat-number">{highPriority || 2}</span>
            <div className="stat-icon-wrap bg-red-light"><i className="bi bi-flag text-red"></i></div>
          </div>
          <div className="trend-neutral mb-2">— same as last week</div>
          <div className="stat-chart-line line-red"></div>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="analytics-charts-row">
        <div className="chart-card paper-card">
          <h3 className="chart-title">Task Priority Breakdown</h3>
          <div className="chart-container d-flex align-items-center">
            <div style={{width: '60%', height: '180px', position: 'relative'}}>
              <Doughnut data={priorityData} options={{...chartOptions, cutout: '70%'}} />
              <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{top: 0, left: 0}}>
                <span className="fs-3 fw-bold">{totalTasks || 4}</span>
                <span className="text-muted" style={{fontSize: '0.7rem'}}>Total Tasks</span>
              </div>
            </div>
            <div className="ms-4" style={{fontSize: '0.8rem'}}>
              <div className="d-flex align-items-center mb-2"><span className="badge rounded-pill me-2" style={{background: '#e74c3c'}}>&nbsp;</span> High <span className="ms-auto text-muted">2 (50%)</span></div>
              <div className="d-flex align-items-center mb-2"><span className="badge rounded-pill me-2" style={{background: '#f5b041'}}>&nbsp;</span> Medium <span className="ms-auto text-muted">2 (50%)</span></div>
              <div className="d-flex align-items-center"><span className="badge rounded-pill me-2" style={{background: '#70846b'}}>&nbsp;</span> Low <span className="ms-auto text-muted">0 (0%)</span></div>
            </div>
          </div>
        </div>

        <div className="chart-card paper-card position-relative">
          <div className="washi-tape" style={{left: '5%', top: '-8px', transform: 'rotate(-2deg)'}}></div>
          <h3 className="chart-title">Study Sessions — Last 7 Days</h3>
          <div className="chart-container pe-4 pt-2">
            <Bar data={sessionData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="analytics-bottom-row">
        <div className="chart-card paper-card justify-content-center">
          <h3 className="chart-title border-0 mb-2">Completion Rate</h3>
          <div className="d-flex align-items-center gap-3">
            <div className="completion-circle">
              <span className="completion-value">{completionRate || 25}%</span>
              <span className="completion-label">Completed</span>
            </div>
            <div className="text-muted" style={{fontSize: '0.8rem'}}>
              1 of 4 tasks completed
              <div className="progress mt-2" style={{height: '4px'}}>
                <div className="progress-bar" style={{width: '25%', background: 'var(--accent-sage)'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card paper-card">
          <h3 className="chart-title border-0 mb-0">Weekly Trend</h3>
          <div className="chart-container mt-2">
            <Line data={trendData} options={lineOptions} />
          </div>
        </div>

        <div className="chart-card paper-card">
          <h3 className="chart-title border-0 mb-3">Focus Time</h3>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="stat-icon-wrap" style={{width: '45px', height: '45px', background: '#f5e4e1'}}><i className="bi bi-clock text-dark"></i></div>
            <div>
              <div className="focus-time-value">2h 45m</div>
              <div className="text-muted" style={{fontSize: '0.7rem'}}>Total focus time</div>
            </div>
          </div>
          <div className="trend-up"><i className="bi bi-arrow-up"></i> 45m from last week</div>
        </div>

        <div className="analytics-sticky d-flex flex-column justify-content-center align-items-center text-center">
          <div className="metallic-pin-small"></div>
          <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem'}}>Top Focus Day</div>
          <div className="text-muted mb-2" style={{fontSize: '0.75rem'}}>May 2, 2025</div>
          <div className="text-sage fw-bold" style={{fontSize: '1rem'}}>60 mins</div>
          <div className="heart-doodle" style={{bottom: '5px', right: '10px'}}><i className="bi bi-leaf"></i></div>
        </div>
      </div>

    </div>
  );
}