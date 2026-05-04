import React, { useState } from 'react';
import './Tasks.css';

const API = 'http://127.0.0.1:5001/api/tasks';

export default function Tasks({ tasks, setTasks, authFetch }) {
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [filter, setFilter] = useState('all');

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await authFetch(API, { method: 'POST', body: JSON.stringify(newTask) });
      const saved = await res.json();
      setTasks([saved, ...tasks]);
      setNewTask({ title: '', priority: 'medium', dueDate: '' });
    } catch (e) {
      const mockTask = {
        ...newTask,
        _id: Date.now().toString(),
        isDone: false,
        createdAt: new Date().toISOString()
      };
      setTasks([mockTask, ...tasks]);
      setNewTask({ title: '', priority: 'medium', dueDate: '' });
    }
  };

  const toggleDone = async (id) => {
    try {
      const res = await authFetch(`${API}/${id}`, { method: 'PUT' });
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === id ? updated : t));
    } catch (e) {
      setTasks(tasks.map(t => t._id === id ? { ...t, isDone: !t.isDone } : t));
    }
  };

  const deleteTask = async (id) => {
    try {
      await authFetch(`${API}/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setTasks(tasks.filter(t => t._id !== id));
  };

  const priorityWeights = { high: 1, medium: 2, low: 3 };
  const filteredTasks = tasks.filter(t => filter === 'all' || t.priority === filter);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
    if (priorityWeights[a.priority] !== priorityWeights[b.priority])
      return priorityWeights[a.priority] - priorityWeights[b.priority];
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const completedCount = tasks.filter(t => t.isDone).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="d-flex flex-column h-100">

      {/* ── PAGE HEADER ── */}
      <div className="mb-4">
        <h2 className="mb-0" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
          Your Tasks
        </h2>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Organize, prioritize and get things done.
        </p>
      </div>

      <div className="tasks-dashboard">
        <div className="tasks-main-column">

          {/* ── ADD TASK — washi tape is sibling to card ── */}
          <div className="add-task-wrapper">
            <div className="washi-tape"></div>
            <div className="add-task-card paper-card">
              <div className="fw-semibold ms-4 ps-2 mb-2">Add New Task</div>
              <div className="add-task-input-wrapper">
                <input
                  type="text"
                  className="add-task-input"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyPress={e => e.key === 'Enter' && addTask()}
                />
                <div className="add-task-actions">
                  <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-calendar3"></i>
                    <input
                      type="date"
                      className="border-0 bg-transparent text-muted"
                      style={{ width: '110px' }}
                      value={newTask.dueDate}
                      onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted ms-2" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-flag"></i>
                    <select
                      className="border-0 bg-transparent fw-medium"
                      style={{
                        color: newTask.priority === 'high' ? '#e74c3c'
                             : newTask.priority === 'medium' ? '#f5b041'
                             : '#70846b'
                      }}
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-sm text-white ms-2"
                    style={{ background: 'var(--accent-sage)', borderRadius: '6px', padding: '0.3rem 0.8rem' }}
                    onClick={addTask}
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── FILTERS ── */}
          <div className="tasks-filter-row">
            <div className="d-flex gap-2">
              <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                <i className="bi bi-list-task"></i> All Tasks
              </button>
              <button className={`filter-btn ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>
                <i className="bi bi-flag text-danger"></i> High Priority
              </button>
              <button className={`filter-btn ${filter === 'medium' ? 'active' : ''}`} onClick={() => setFilter('medium')}>
                <i className="bi bi-circle-fill text-warning" style={{ fontSize: '0.6rem' }}></i> Medium Priority
              </button>
              <button className={`filter-btn ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>
                <i className="bi bi-circle border border-success rounded-circle" style={{ fontSize: '0.6rem' }}></i> Low Priority
              </button>
            </div>
          </div>

          {/* ── NOTEBOOK — binding is flex sibling to content ── */}
          <div className="notebook-wrapper">

            {/* Binding: flex child, always full height of wrapper */}
            <div className="spiral-binding"></div>

            {/* Scrollable content */}
            <div className="tasks-notebook">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-semibold" style={{ color: 'var(--accent-sage)' }}>
                  {tasks.length} Tasks
                </div>
                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                  {completedCount}/{tasks.length} completed
                  <div className="progress" style={{ width: '60px', height: '6px' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${progressPercent}%`, background: 'var(--accent-sage)' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="notebook-list">
                {sortedTasks.length === 0 ? (
                  <div className="text-center text-muted mt-4">No tasks found.</div>
                ) : (
                  sortedTasks.map(task => (
                    <div key={task._id} className="task-item-row">
                      <div
                        className={`faux-checkbox ${task.isDone ? 'checked' : ''}`}
                        onClick={() => toggleDone(task._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {task.isDone && <i className="bi bi-check2"></i>}
                      </div>
                      <div className="task-item-content">
                        <div className={`task-title fw-medium ${task.isDone ? 'done text-muted' : ''}`}>
                          {task.title}
                        </div>
                        <div className="d-flex gap-2 mt-1">
                          {task.priority === 'high' && (
                            <span className="task-tag tag-high">High</span>
                          )}
                          {task.priority === 'high' && !task.isDone && (
                            <span className="task-tag" style={{ background: '#fdf2f0', color: '#e74c3c' }}>
                              <i className="bi bi-exclamation-triangle"></i> Urgent
                            </span>
                          )}
                          {task.priority === 'medium' && (
                            <span className="task-tag tag-medium">Medium</span>
                          )}
                          {task.priority === 'low' && (
                            <span className="task-tag" style={{ background: '#edf2eb', color: '#70846b' }}>
                              Low
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-item-actions">
                        {task.dueDate && (
                          <span style={{ fontSize: '0.8rem' }}>
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                        <i
                          className="bi bi-three-dots-vertical ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteTask(task._id)}
                        ></i>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center mt-4">
                <span className="text-muted" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  View completed tasks ({completedCount}) <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>

          </div>
          {/* end notebook-wrapper */}

        </div>
      </div>
    </div>
  );
}