import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement
);

export default function Analytics({ tasks = [], authFetch }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!authFetch) return;
    authFetch('http://127.0.0.1:5001/api/sessions')
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {});
  }, [authFetch]);

  // ── DATA ──────────────────────────────────────────
  const totalTasks     = tasks.length;
  const completedTasks = tasks.filter(t => t.isDone).length;
  const activeTasks    = totalTasks - completedTasks;
  const highPriority   = tasks.filter(t => t.priority === 'high').length;
  const medPriority    = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority    = tasks.filter(t => t.priority === 'low').length;

  // ── LAST 7 DAYS ───────────────────────────────────
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

  const hasSessions = sessionsByDay.some(x => x > 0);
  const hasTasks    = totalTasks > 0;

  // ── CHART DATA — only real data, no fallbacks ─────
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [highPriority, medPriority, lowPriority],
      backgroundColor: ['#b85c52', '#c9963a', '#70846b'],  /* muted tones */
      borderWidth: 0,
      cutout: '72%',
    }]
  };

  const sessionData = {
    labels: dayLabels,
    datasets: [{
      label: 'Minutes studied',
      data: sessionsByDay,
      backgroundColor: '#a3b19b',
      borderRadius: 4,
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
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { callback: v => `${v}m`, color: '#afa8a0', font: { size: 10 } },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#afa8a0', font: { size: 10 } },
        border: { display: false }
      }
    }
  };

  return (
    <div className="analytics-dashboard">

      {/* ── HEADER ── */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <h2 className="mb-0" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
            Your Productivity
          </h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Track your progress and build better habits.
          </p>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="home-stats-row">
        <div className="stat-card paper-card">
          <div className="stat-label">TOTAL TASKS</div>
          <div className="stat-value-row">
            <span className="stat-number">{totalTasks}</span>
            <div className="stat-icon-wrap">
              <i className="bi bi-clipboard"></i>
            </div>
          </div>
          <div className="stat-chart-line line-gray"></div>
        </div>

        <div className="stat-card paper-card">
          <div className="stat-label">COMPLETED</div>
          <div className="stat-value-row">
            <span className="stat-number">{completedTasks}</span>
            <div className="stat-icon-wrap bg-sage-light">
              <i className="bi bi-check-circle text-sage"></i>
            </div>
          </div>
          <div className="stat-chart-line line-sage"></div>
        </div>

        <div className="stat-card paper-card">
          <div className="stat-label">IN PROGRESS</div>
          <div className="stat-value-row">
            <span className="stat-number">{activeTasks}</span>
            <div className="stat-icon-wrap bg-yellow-light">
              <i className="bi bi-clock text-yellow"></i>
            </div>
          </div>
          <div className="stat-chart-line line-yellow"></div>
        </div>

        <div className="stat-card paper-card">
          <div className="stat-label">HIGH PRIORITY</div>
          <div className="stat-value-row">
            <span className="stat-number">{highPriority}</span>
            <div className="stat-icon-wrap bg-red-light">
              <i className="bi bi-flag text-red"></i>
            </div>
          </div>
          <div className="stat-chart-line line-red"></div>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="analytics-charts-row">

        {/* Priority Breakdown */}
        <div className="chart-card paper-card">
          <h3 className="chart-title">Task Priority Breakdown</h3>
          {!hasTasks ? (
            <div className="analytics-empty">
              <i className="bi bi-pie-chart"></i>
              <span>No tasks yet</span>
            </div>
          ) : (
            <div className="chart-container d-flex align-items-center">
              <div style={{ width: '55%', height: '180px', position: 'relative', flexShrink: 0 }}>
                <Doughnut data={priorityData} options={chartOptions} />
                <div
                  className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                  style={{ top: 0, left: 0, pointerEvents: 'none' }}
                >
                  <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>{totalTasks}</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>Tasks</span>
                </div>
              </div>

              {/* Fixed legend — dot + label + value on same row */}
              <div className="priority-legend">
                <div className="priority-legend-item">
                  <span className="priority-dot" style={{ background: '#b85c52' }}></span>
                  <span className="priority-legend-label">High</span>
                  <span className="priority-legend-value">
                    {highPriority} ({totalTasks > 0 ? Math.round(highPriority / totalTasks * 100) : 0}%)
                  </span>
                </div>
                <div className="priority-legend-item">
                  <span className="priority-dot" style={{ background: '#c9963a' }}></span>
                  <span className="priority-legend-label">Medium</span>
                  <span className="priority-legend-value">
                    {medPriority} ({totalTasks > 0 ? Math.round(medPriority / totalTasks * 100) : 0}%)
                  </span>
                </div>
                <div className="priority-legend-item">
                  <span className="priority-dot" style={{ background: '#70846b' }}></span>
                  <span className="priority-legend-label">Low</span>
                  <span className="priority-legend-value">
                    {lowPriority} ({totalTasks > 0 ? Math.round(lowPriority / totalTasks * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Study Sessions */}
        <div className="chart-card paper-card position-relative">
          <div className="washi-tape" style={{ left: '5%', top: '-8px', transform: 'rotate(-2deg)' }}></div>
          <h3 className="chart-title">Study Sessions — Last 7 Days</h3>
          {!hasSessions ? (
            <div className="analytics-empty">
              <i className="bi bi-bar-chart"></i>
              <span>No study sessions recorded yet</span>
            </div>
          ) : (
            <div className="chart-container pe-4 pt-2">
              <Bar data={sessionData} options={barOptions} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}