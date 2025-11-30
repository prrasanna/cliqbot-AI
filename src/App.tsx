
import React, { useState } from 'react';
import { MessageSquare, PanelRight } from 'lucide-react';
import type { Message, LeadInfo, Note, Meeting, Suggestion, WidgetTab, UserProfile } from './types';
import { INITIAL_LEAD, MOCK_NOTES, INITIAL_SUGGESTIONS } from './constants';
import * as GeminiService from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import WidgetPanel from './components/WidgetPanel';
import LoginScreen from './components/LoginScreen';
import ProfileModal from './components/ProfileModal';

const App: React.FC = () => {
  // State: Authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State: Chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hello! I am your CliqAI Assistant. I can help you qualify leads, schedule meetings, and manage your notes. Who are we speaking with today?',
      timestamp: new Date(),
      sender: ''
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);

  // State: Widget
  const [activeTab, setActiveTab] = useState<WidgetTab>('lead');
  const [leadInfo, setLeadInfo] = useState<LeadInfo>(INITIAL_LEAD);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showWidget, setShowWidget] = useState(true);

  // Auth Handlers
  const handleLogin = (method: 'google' | 'email', email?: string) => {
    // Determine name from email or default
    let name = 'User';
    if (method === 'google') {
      name = 'Alex Johnson';
    } else if (email) {
      // Extract name from email (e.g. john.doe@example.com -> John Doe)
      const localPart = email.split('@')[0];
      name = localPart
        .split(/[._]/) // Split by dot or underscore
        .map(part => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize
        .join(' ');
    }

    // Generate Initials
    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    // Simulate login
    setCurrentUser({
      id: 'u123',
      name: name,
      email: email || 'alex.johnson@example.com',
      jobTitle: 'Sales Manager',
      avatarInitials: initials,
      status: 'Available',
      bio: 'Passionate about connecting people with the right solutions.',
      notifications: {
        email: true,
        push: false
      },
      theme: 'light'
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
  };

  // Chat Handlers
  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      sender: ''
    };

    // Optimistically update UI
    const newHistory = [...messages, newMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsTyping(true);
    setSuggestions([]); // Clear suggestions while processing

    // 1. Get AI Response
    // Note: We pass the history including the new message, the service handles context properly
    const responseText = await GeminiService.sendMessageToGemini(newHistory, text);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date(),
      sender: ''
    };
    
    const updatedHistory = [...newHistory, botMessage];
    setMessages(updatedHistory);
    setIsTyping(false);

    // Optimized: Only run analysis every 2 turns and if conversation is sufficient length
    if (updatedHistory.length >= 4 && updatedHistory.length % 2 === 0) {
      GeminiService.analyzeLeadData(updatedHistory).then(analysis => {
        if (analysis) {
          setLeadInfo(prev => ({ ...prev, ...analysis }));
        }
      });
    }

    // 3. Parallel Process: Get Smart Suggestions
    // Only fetch if response is valid (not an error) to save quota
    if (!responseText.includes("trouble connecting") && !responseText.includes("error processing")) {
      GeminiService.getSmartSuggestions(responseText).then(newSuggestions => {
        if (newSuggestions && newSuggestions.length > 0) {
          setSuggestions(newSuggestions);
        }
      });
    }
  };

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleScheduleMeeting = (meeting: Meeting) => {
    setMeetings(prev => [...prev, meeting]);
  };

  // Render Login Screen if not authenticated
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Determine Status Color Class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'Busy': return 'status-busy';
      case 'Away': return 'status-away';
      case 'Do Not Disturb': return 'status-dnd';
      default: return 'status-available';
    }
  };

  return (
    <div className="app-container">
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUpdate={handleUpdateProfile}
        onLogout={handleLogout}
      />

      {/* Left Navigation Rail (Zoho Cliq Style) */}
      <div className="nav-rail">
        {/* App Logo */}
        <div className="nav-logo" title="CliqAI Assistant">
          C
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">
           <button className="nav-btn active" title="Messages">
              <MessageSquare size={20} />
           </button>
           <button 
            onClick={() => setShowWidget(!showWidget)}
            className={`nav-btn widget-toggle ${showWidget ? 'active' : ''}`}
            title="Toggle Widget Panel"
           >
              <PanelRight size={20} />
           </button>
        </div>

        {/* User Profile Action (Bottom of Rail) */}
        <div className="nav-footer">
           <button 
             onClick={() => setIsProfileOpen(true)}
             className="nav-profile-btn"
             title="Profile Settings"
           >
             {currentUser.avatarInitials}
             {/* Status Dot */}
             <span className={`status-dot ${getStatusClass(currentUser.status)}`}></span>
           </button>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="main-layout">
        
        {/* Chat Area */}
        <ChatInterface 
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={() => handleSendMessage()}
          isLoading={isTyping}
          suggestions={suggestions}
          onSuggestionClick={(action) => handleSendMessage(action)}
        />

        {/* Right Sidebar Widget (Collapsible) */}
        {showWidget && (
          <WidgetPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            leadInfo={leadInfo}
            notes={notes}
            onAddNote={handleAddNote}
            meetings={meetings}
            onScheduleMeeting={handleScheduleMeeting}
          />
        )}

      </div>
    </div>
  );
};

export default App;
