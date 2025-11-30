import React, { useState } from 'react';
import { X, User, Briefcase, Mail, LogOut, Camera, Bell, Monitor, Moon, Sun, Check, AlertCircle } from 'lucide-react';
import type { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

type Tab = 'general' | 'preferences';

const ProfileModal: React.FC<ProfileModalProps> = ({ user, isOpen, onClose, onUpdate, onLogout }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formData.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
      
    onUpdate({ ...formData, avatarInitials: initials });
    onClose();
  };

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'Busy': return 'status-busy';
      case 'Away': return 'status-away';
      case 'Do Not Disturb': return 'status-dnd';
      default: return 'status-available';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">Account Settings</h3>
            <button type="button" onClick={onClose} style={{ color: '#9ca3af' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="modal-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`modal-tab ${activeTab === 'general' ? 'active' : ''}`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`modal-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            >
              Preferences
            </button>
          </div>

          {/* Content Scroll Area */}
          <div className="modal-body">
            
            {/* --- General Tab --- */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Avatar & Status */}
                <div className="profile-avatar-section">
                  <div className="avatar-large">
                      {formData.avatarInitials}
                      <button type="button" className="btn-camera">
                        <Camera size={14} color="#4b5563" />
                      </button>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="status-select-wrapper">
                     <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="status-select"
                     >
                       <option value="Available">Available</option>
                       <option value="Busy">Busy</option>
                       <option value="Away">Away</option>
                       <option value="Do Not Disturb">Do Not Disturb</option>
                     </select>
                     <div className={`status-dot-select ${getStatusDotClass(formData.status)}`}></div>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">DISPLAY NAME</label>
                    <div className="input-icon-wrapper">
                      <div className="input-icon">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="login-input" // Reusing styles
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">JOB TITLE</label>
                    <div className="input-icon-wrapper">
                      <div className="input-icon">
                        <Briefcase size={16} />
                      </div>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        className="login-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">EMAIL</label>
                    <div className="input-icon-wrapper">
                      <div className="input-icon">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        readOnly
                        className="login-input"
                        style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">BIO</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="login-input"
                      style={{ resize: 'none' }}
                      placeholder="Tell us a little bit about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- Preferences Tab --- */}
            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Notifications */}
                <div className="settings-group">
                  <h4 className="settings-title">
                    <Bell size={16} color="#3b82f6" /> Notifications
                  </h4>
                  <div>
                    <label className="setting-item">
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Email Digests</span>
                      <input 
                        type="checkbox" 
                        checked={formData.notifications.email}
                        onChange={(e) => setFormData({
                          ...formData, 
                          notifications: { ...formData.notifications, email: e.target.checked }
                        })}
                      />
                    </label>
                    <label className="setting-item">
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Push Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={formData.notifications.push}
                        onChange={(e) => setFormData({
                          ...formData, 
                          notifications: { ...formData.notifications, push: e.target.checked }
                        })}
                      />
                    </label>
                  </div>
                </div>

                {/* Appearance */}
                <div className="settings-group">
                  <h4 className="settings-title">
                    <Monitor size={16} color="#8b5cf6" /> Appearance
                  </h4>
                  <div className="theme-grid">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, theme: 'light'})}
                      className={`theme-btn ${formData.theme === 'light' ? 'active' : ''}`}
                    >
                      <Sun size={20} />
                      <span className="theme-label">Light</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, theme: 'dark'})}
                      className={`theme-btn ${formData.theme === 'dark' ? 'active' : ''}`}
                    >
                      <Moon size={20} />
                      <span className="theme-label">Dark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({...formData, theme: 'system'})}
                      className={`theme-btn ${formData.theme === 'system' ? 'active' : ''}`}
                    >
                      <Monitor size={20} />
                      <span className="theme-label">System</span>
                    </button>
                  </div>
                </div>
                
                {/* Danger Zone */}
                <div className="danger-zone">
                  <h4 className="danger-title">
                    <AlertCircle size={12} /> Danger Zone
                  </h4>
                  <button 
                    type="button" 
                    onClick={onLogout}
                    className="btn-logout"
                  >
                    <LogOut size={16} />
                    Sign Out of Account
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;