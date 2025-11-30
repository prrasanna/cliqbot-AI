import React, { useState } from 'react';
import { User, Notebook, Calendar, Mail, Phone, Building, Star, Plus } from 'lucide-react';
import type { LeadInfo, Note, Meeting, WidgetTab } from '../types';

interface WidgetPanelProps {
  activeTab: WidgetTab;
  setActiveTab: (tab: WidgetTab) => void;
  leadInfo: LeadInfo;
  notes: Note[];
  onAddNote: (content: string) => void;
  meetings: Meeting[];
  onScheduleMeeting: (meeting: Meeting) => void;
}

const WidgetPanel: React.FC<WidgetPanelProps> = ({
  activeTab,
  setActiveTab,
  leadInfo,
  notes,
  onAddNote,
  meetings,
  onScheduleMeeting
}) => {
  const [newNote, setNewNote] = useState('');
  const [meetingForm, setMeetingForm] = useState({ title: 'Product Demo', date: '', time: '' });

  const handleSaveNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingForm.date && meetingForm.time) {
      onScheduleMeeting({
        id: Date.now().toString(),
        title: meetingForm.title,
        date: meetingForm.date,
        time: meetingForm.time,
        participants: [leadInfo.name, 'You']
      });
      setMeetingForm({ title: 'Product Demo', date: '', time: '' });
      alert("Meeting Scheduled!");
    }
  };

  const getScoreClass = (score: number) => {
    if (score > 70) return 'score-high';
    if (score > 40) return 'score-med';
    return 'score-low';
  };

  return (
    <div className="widget-panel">
      {/* Widget Tabs */}
      <div className="widget-tabs">
        <button
          onClick={() => setActiveTab('lead')}
          className={`tab-btn ${activeTab === 'lead' ? 'active' : ''}`}
        >
          <User size={16} /> Lead
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
        >
          <Notebook size={16} /> Notes
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
        >
          <Calendar size={16} /> Meet
        </button>
      </div>

      {/* Content Area */}
      <div className="widget-content">
        
        {/* LEAD INFO TAB */}
        {activeTab === 'lead' && (
          <>
            <div className="info-card">
              <div className="lead-header">
                <div className="lead-avatar">
                  {leadInfo.name.charAt(0)}
                </div>
                <div className="lead-details">
                  <h3>{leadInfo.name}</h3>
                  <p>{leadInfo.status}</p>
                </div>
                <div className="lead-score-box">
                  <span className={`score-badge ${getScoreClass(leadInfo.score)}`}>
                    {leadInfo.score}/100
                  </span>
                  <span className="score-label">Lead Score</span>
                </div>
              </div>

              <div className="lead-contact-info">
                <div className="detail-row">
                  <Building size={14} /> <span>{leadInfo.company}</span>
                </div>
                <div className="detail-row">
                  <Mail size={14} /> <span>{leadInfo.email}</span>
                </div>
                <div className="detail-row">
                  <Phone size={14} /> <span>{leadInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="info-card ai-summary">
              <h4>
                <Star size={14} fill="#eab308" stroke="#eab308" /> AI Summary
              </h4>
              <p>{leadInfo.summary}</p>
            </div>
          </>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div>
            <div className="note-input-area">
              <textarea
                className="note-textarea"
                rows={3}
                placeholder="Add a CRM note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button onClick={handleSaveNote} className="btn-add-note">
                <Plus size={12} /> Add Note
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  <p>{note.content}</p>
                  <p className="note-date">
                    {note.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <>
             <div className="info-card">
               <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Schedule Meeting</h4>
               <form onSubmit={handleSchedule}>
                 <div className="form-group">
                   <label className="form-label">Title</label>
                   <input 
                      type="text" 
                      className="form-input"
                      value={meetingForm.title}
                      onChange={e => setMeetingForm({...meetingForm, title: e.target.value})}
                    />
                 </div>
                 <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input 
                        type="date" 
                        required
                        className="form-input"
                        value={meetingForm.date}
                        onChange={e => setMeetingForm({...meetingForm, date: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input 
                        type="time" 
                        required
                        className="form-input"
                        value={meetingForm.time}
                        onChange={e => setMeetingForm({...meetingForm, time: e.target.value})}
                      />
                    </div>
                 </div>
                 <button type="submit" className="btn-block">
                   Send Invitation
                 </button>
               </form>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', margin: '0.5rem 0' }}>Upcoming</h4>
               {meetings.length === 0 && <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>No meetings scheduled.</p>}
               {meetings.map(m => (
                 <div key={m.id} className="meeting-card">
                   <div className="meeting-header">
                     <h5 className="meeting-title">{m.title}</h5>
                     <span className="meeting-time">{m.time}</span>
                   </div>
                   <p className="meeting-date">{new Date(m.date).toDateString()}</p>
                   <div className="meeting-participants">
                      <User size={10} /> {m.participants.join(', ')}
                   </div>
                 </div>
               ))}
             </div>
          </>
        )}

      </div>
    </div>
  );
};

export default WidgetPanel;