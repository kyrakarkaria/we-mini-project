import React, { useState, useEffect, useRef } from 'react';
import './pomodoro.css';

import playIcon from './assets/play.png';
import pauseIcon from './assets/pause.png';
import resetIcon from './assets/reset.png';
import addIcon from './assets/add.png';
import deleteIcon from './assets/delete.png';
import windowImg from './assets/window.png';
import dogGif from './assets/Dog.gif';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h >= 5 && h < 12) return "Good Morning";
    if (h >= 12 && h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isStudy, setIsStudy] = useState(true);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(p => p - 1), 1000);
    } else if (time <= 0) {
      setIsStudy(s => !s);
      setTime(isStudy ? 5 * 60 : 25 * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isStudy]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(isStudy ? 25 * 60 : 5 * 60);
  };

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const circumference = 2 * Math.PI * 45;
  const totalTime = isStudy ? 25 * 60 : 5 * 60;
  const dashoffset = circumference - (time / totalTime) * circumference;

  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: taskInput, isDone: false }]);
    setTaskInput('');
  };

  const toggleTask = id => setTasks(t => t.map(x => x.id === id ? { ...x, isDone: !x.isDone } : x));
  const deleteTask = id => setTasks(t => t.filter(x => x.id !== id));

  const done = tasks.filter(t => t.isDone).length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const [notes, setNotes] = useState('');

  return (
    <div id="fullCard">

      <div id="header">
        <p id="headerText">{getGreeting()}, Kyra</p>
        <div id="datetime">
          <p>{currentTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div id="col1">
        <div id="pomodoroTimer">
          <div id="timerContainer">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle id="track" cx="50" cy="50" r="45" />
              <circle
                id="progress"
                cx="50" cy="50" r="45"
                style={{ strokeDasharray: circumference, strokeDashoffset: dashoffset }}
              />
            </svg>
            <p id="timer">{formatTime(time)}</p>
          </div>
          <div id="timerButtons">
            <img src={playIcon} alt="play" onClick={() => setIsRunning(true)} />
            <img src={pauseIcon} alt="pause" onClick={() => setIsRunning(false)} />
            <img src={resetIcon} alt="reset" onClick={resetTimer} />
          </div>
          <p id="timer_text">
            {!isRunning
              ? `Start the ${isStudy ? 'Study' : 'Break'} Timer`
              : isStudy ? "You're doing great!" : "Enjoy your break!"}
          </p>
        </div>
        <div id="spotify">
          <iframe
            src="https://widgets.commoninja.com/iframe/a6ea9287-cf32-4cbf-8ffc-a2195c2adcea"
            width="100%" height="100%" frameBorder="0" scrolling="no" title="music"
          />
        </div>
      </div>

      <div id="middle">
        <div id="window"><img src={windowImg} alt="window" /></div>
        <div id="dog"><img src={dogGif} alt="dog" /></div>
      </div>

      <div id="col3">
        <div id="toDoList">
          <p id="todoTitle">To-Do List</p>
          <div id="todoInputRow">
            <input
              id="todoInput"
              type="text"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTask()}
              placeholder="Add a new task"
            />
            <img src={addIcon} id="addButton" alt="add" onClick={addTask} />
          </div>
          <ul id="list">
            {tasks.map(task => (
              <li key={task.id}>
                <input type="checkbox" checked={task.isDone} onChange={() => toggleTask(task.id)} />
                <span className={task.isDone ? 'done' : ''}>{task.text}</span>
                <img src={deleteIcon} className="delete-btn" alt="delete" onClick={() => deleteTask(task.id)} />
              </li>
            ))}
          </ul>
        </div>

        <div id="notes">
          <textarea
            id="notesText"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Write your notes here..."
          />
        </div>
      </div>

      <div id="footer">
        <p>Tasks Completed</p>
        <div id="progressBar">
          <div id="actualBar" style={{ width: `${pct}%` }}>
            <span>{pct}%</span>
          </div>
        </div>
      </div>

    </div>
  );
}