import React, { useState } from 'react';
import './Notes.css';

const API = 'http://127.0.0.1:5001/api/notes';

export default function Notes({ notes, setNotes, authFetch }) {
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const createNote = async () => {
    const newNote = { title: 'Untitled Note', content: '', updatedAt: Date.now() };
    try {
      const res  = await authFetch(API, { method: 'POST', body: JSON.stringify(newNote) });
      const saved = await res.json();
      setNotes([saved, ...notes]);
      setActiveNote(saved);
    } catch (e) {
      const mock = { ...newNote, _id: Date.now().toString() };
      setNotes([mock, ...notes]);
      setActiveNote(mock);
    }
  };

  const saveNote = async () => {
    if (!activeNote) return;
    try {
      const res  = await authFetch(`${API}/${activeNote._id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: activeNote.title, content: activeNote.content })
      });
      const updated = await res.json();
      setNotes(notes.map(n => n._id === updated._id ? updated : n));
    } catch (e) {
      setNotes(notes.map(n => n._id === activeNote._id ? activeNote : n));
    }
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    try { await authFetch(`${API}/${id}`, { method: 'DELETE' }); } catch (e) {}
    setNotes(notes.filter(n => n._id !== id));
    if (activeNote?._id === id) setActiveNote(null);
  };

  const filteredNotes = notes.filter(n => 
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="d-flex flex-column h-100">
      
      {/* ── HEADER & SEARCH ── */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="mb-0" style={{fontFamily: 'var(--font-serif)', color: 'var(--text-main)'}}>Your Notes</h2>
          <p className="text-muted" style={{fontSize: '0.85rem'}}>Capture ideas, thoughts and everything in between.</p>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="notes-search-wrapper">
            <i className="bi bi-search notes-search-icon"></i>
            <input type="text" className="notes-search-input" placeholder="Search notes..." 
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn text-white fw-medium d-flex align-items-center gap-2" style={{background: 'var(--accent-sage)', padding: '0.6rem 1.2rem', borderRadius: '8px'}} onClick={createNote}>
            <i className="bi bi-plus-lg"></i> New Note
          </button>
          <button className="btn bg-white border border-light text-muted px-3"><i className="bi bi-list"></i></button>
          <button className="btn bg-white border border-light text-muted px-3"><i className="bi bi-grid"></i></button>
        </div>
      </div>

      {/* ── 3-COLUMN GRID ── */}
      <div className="notes-dashboard">
        
        {/* LEFT COL: Notes List */}
        <div className="paper-card notes-list-card">
          <div className="notes-list-header">
            <button className={`note-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Notes</button>
            <button className={`note-filter-tab ${filter === 'study' ? 'active' : ''}`} onClick={() => setFilter('study')}>Study</button>
            <button className={`note-filter-tab ${filter === 'personal' ? 'active' : ''}`} onClick={() => setFilter('personal')}>Personal</button>
            <button className={`note-filter-tab ${filter === 'ideas' ? 'active' : ''}`} onClick={() => setFilter('ideas')}>Ideas</button>
            <i className="bi bi-three-dots text-muted ms-auto mt-1 cursor-pointer"></i>
          </div>
          
          <div className="notes-list-items">
            {filteredNotes.length === 0 ? (
              <div className="text-muted text-center p-4" style={{fontSize: '0.85rem'}}>No notes found.</div>
            ) : (
              filteredNotes.map(note => (
                <button key={note._id} 
                  className={`note-list-item ${activeNote?._id === note._id ? 'active' : ''}`}
                  onClick={() => setActiveNote(note)}>
                  <div className="note-item-icon"></div>
                  <div className="note-item-content text-truncate">
                    <div className="note-item-title d-flex justify-content-between">
                      <span className="text-truncate">{note.title || 'Untitled Note'}</span>
                      <i className="bi bi-pin-angle ms-1 text-muted" style={{fontSize: '0.8rem'}}></i>
                    </div>
                    <div className="note-item-date">{new Date(note.updatedAt || Date.now()).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</div>
                  </div>
                  <div className="note-item-dot ms-2" style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-sage)', opacity: activeNote?._id === note._id ? 1 : 0}}></div>
                </button>
              ))
            )}
          </div>
          <div className="text-center p-2 border-top text-muted" style={{fontSize: '0.75rem', borderColor: 'var(--border)'}}>
            {filteredNotes.length} notes
          </div>
        </div>

        {/* CENTER COL: Editor */}
        <div className="editor-notebook">
          {activeNote ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{marginLeft: '1rem'}}>
                <input type="text"
                  className="editor-title-input"
                  value={activeNote.title}
                  placeholder="Untitled Note"
                  onChange={e => setActiveNote({ ...activeNote, title: e.target.value })} 
                  onBlur={saveNote} />
                <div className="d-flex gap-3 text-muted" style={{fontSize: '1.2rem'}}>
                  <i className="bi bi-star cursor-pointer"></i>
                  <i className="bi bi-upload cursor-pointer"></i>
                  <i className="bi bi-three-dots cursor-pointer" onClick={e => deleteNote(activeNote._id, e)}></i>
                </div>
              </div>
              <div className="text-muted mb-4" style={{marginLeft: '1rem', fontSize: '0.85rem'}}>
                Today, {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
              </div>
              
              <textarea
                className="editor-textarea"
                style={{marginLeft: '1rem'}}
                placeholder="Start typing your notes here..."
                value={activeNote.content}
                onChange={e => setActiveNote({ ...activeNote, content: e.target.value })} 
                onBlur={saveNote} />
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <div style={{ fontSize: '4rem', opacity: 0.3 }}><i className="bi bi-journal-text"></i></div>
              <h4 className="mt-3" style={{fontFamily: 'var(--font-serif)'}}>Select a note to read</h4>
            </div>
          )}
        </div>

        

      </div>
    </div>
  );
}