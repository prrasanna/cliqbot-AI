
import React, { useEffect, useRef } from 'react';
import { Send, Zap, MoreHorizontal, Bot } from 'lucide-react';
import type { Message, Suggestion } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  suggestions: Suggestion[];
  onSuggestionClick: (action: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  setInputValue,
  onSend,
  isLoading,
  suggestions,
  onSuggestionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="bot-info">
          <div className="bot-avatar">
            <Bot size={24} />
          </div>
          <div className="bot-details">
            <h2>CliqAI Bot</h2>
            <div className="bot-status">
              <span className="online-indicator"></span>
              <span className="status-text">Online • Automated Support</span>
            </div>
          </div>
        </div>
        <button className="nav-btn">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.role}`}
          >
            <div className={`message-bubble ${msg.role}`}>
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row model">
            <div className="message-bubble model">
              <div className="loading-dots">
                <div className="dot" style={{ animationDelay: '0ms' }}></div>
                <div className="dot" style={{ animationDelay: '150ms' }}></div>
                <div className="dot" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Auto Suggestions */}
        {!isLoading && suggestions.length > 0 && (
          <div className="suggestions-area">
            <div className="suggestions-label">
               <span><Zap size={10} /> Smart Replies</span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(suggestion.action)}
                className="suggestion-chip"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isLoading}
            className="send-btn"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="disclaimer">
            <span>AI-generated content may be inaccurate.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
