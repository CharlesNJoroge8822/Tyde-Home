import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiChevronDown, FiUser, FiMessageSquare, FiClock } from 'react-icons/fi';

const MessagingPage = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const token = localStorage.getItem('token');

  const fetchConversations = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      
      // Select first conversation by default if none selected
      if (response.data.length > 0 && !selectedAdmin) {
        setSelectedAdmin(response.data[0].admin_id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/messages/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  const fetchMessages = async (adminId) => {
    if (!adminId || !token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/messages/conversation/${adminId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAdmin || !token) return;

    setLoading(true);
    try {
      await axios.post(
        'http://127.0.0.1:5000/messages',
        {
          recipient_id: selectedAdmin,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchMessages(selectedAdmin); // Refresh messages
      fetchConversations(); // Refresh conversation list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // If today, show time only
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If yesterday, show "Yesterday"
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // Otherwise show date
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (selectedAdmin) {
      fetchMessages(selectedAdmin);
    }
  }, [selectedAdmin]);

  return (
    <div className="messaging-container">
      {/* Conversation sidebar */}
      <div className="conversation-sidebar">
        <div className="sidebar-header">
          <h3>Messages</h3>
        </div>
        
        <div className="admin-selector">
          <div 
            className="dropdown-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {selectedAdmin 
                ? admins.find(a => a.id === selectedAdmin)?.name || 'Select Admin'
                : 'Select Admin'}
            </span>
            <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
          </div>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {admins.map(admin => (
                <div 
                  key={admin.id}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedAdmin(admin.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <FiUser className="admin-icon" />
                  <span>{admin.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="conversation-list">
          {conversations.map(conv => (
            <div 
              key={conv.admin_id}
              className={`conversation-item ${selectedAdmin === conv.admin_id ? 'active' : ''}`}
              onClick={() => setSelectedAdmin(conv.admin_id)}
            >
              <div className="conversation-header">
                <div className="admin-name">{conv.admin_name}</div>
                <div className="message-time">{formatDate(conv.last_message_time)}</div>
              </div>
              
              <div className="message-preview">
                <FiMessageSquare className="message-icon" />
                <span>{conv.last_message}</span>
              </div>
              
              {conv.unread_count > 0 && (
                <div className="unread-badge">{conv.unread_count}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message area */}
      <div className="message-area">
        {selectedAdmin ? (
          <>
            <div className="message-header">
              <h3>
                <FiUser className="header-icon" />
                {admins.find(a => a.id === selectedAdmin)?.name || 'Admin'}
              </h3>
            </div>
            
            <div className="message-list">
              {loading ? (
                <div className="loading-messages">
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <FiMessageSquare className="empty-icon" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`message-bubble ${msg.sender_id === userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-sender">
                        {msg.sender_id === userId ? 'You' : msg.sender_name}
                      </div>
                      <div className="message-text">{msg.content}</div>
                      <div className="message-time">
                        <FiClock className="time-icon" />
                        {formatDate(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="message-input-container">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                className="message-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || loading}
                className="send-button"
              >
                {loading ? (
                  <div className="send-spinner"></div>
                ) : (
                  <>
                    <span>Send</span>
                    <FiSend className="send-icon" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <FiMessageSquare className="empty-icon" />
            <h3>Select a conversation</h3>
            <p>Choose an admin from the sidebar to start messaging</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .messaging-container {
          display: flex;
          max-width: 1200px;
          height: 80vh;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        
        .conversation-sidebar {
          width: 320px;
          border-right: 1px solid #eaeaea;
          display: flex;
          flex-direction: column;
          background: #f9f9f9;
        }
        
        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .sidebar-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .admin-selector {
          position: relative;
          padding: 15px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .dropdown-trigger:hover {
          border-color: #999;
        }
        
        .dropdown-icon {
          transition: transform 0.2s;
        }
        
        .dropdown-icon.open {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 15px;
          right: 15px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        
        .admin-icon {
          margin-right: 10px;
          color: #666;
        }
        
        .conversation-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }
        
        .conversation-item {
          padding: 15px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .conversation-item:hover {
          background: #f0f0f0;
        }
        
        .conversation-item.active {
          background: #e6f2ff;
        }
        
        .conversation-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .admin-name {
          font-weight: 600;
          color: #333;
        }
        
        .message-time {
          font-size: 12px;
          color: #999;
        }
        
        .message-preview {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .message-icon {
          margin-right: 8px;
          flex-shrink: 0;
          color: #999;
        }
        
        .unread-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #4CAF50;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .message-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fefefe;
        }
        
        .message-header {
          padding: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .message-header h3 {
          margin: 0;
          font-size: 18px;
          display: flex;
          align-items: center;
        }
        
        .header-icon {
          margin-right: 10px;
          color: #555;
        }
        
        .message-list {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f5f7fb;
          display: flex;
          flex-direction: column;
        }
        
        .message-bubble {
          max-width: 70%;
          margin-bottom: 15px;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-bubble.sent {
          align-self: flex-end;
        }
        
        .message-bubble.received {
          align-self: flex-start;
        }
        
        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
          word-wrap: break-word;
        }
        
        .message-bubble.sent .message-content {
          background: #4CAF50;
          color: white;
          border-top-right-radius: 4px;
        }
        
        .message-bubble.received .message-content {
          background: white;
          color: #333;
          border-top-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .message-sender {
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .message-bubble.sent .message-sender {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .message-bubble.received .message-sender {
          color: #666;
        }
        
        .message-text {
          line-height: 1.4;
        }
        
        .message-time {
          font-size: 11px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          opacity: 0.8;
        }
        
        .time-icon {
          margin-right: 4px;
          font-size: 10px;
        }
        
        .message-input-container {
          padding: 15px;
          border-top: 1px solid #eaeaea;
          background: white;
          display: flex;
          align-items: flex-end;
        }
        
        .message-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 24px;
          resize: none;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .message-input:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }
        
        .send-button {
          margin-left: 10px;
          padding: 10px 20px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          font-weight: 500;
        }
        
        .send-button:hover {
          background: #43a047;
        }
        
        .send-button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        
        .send-icon {
          margin-left: 8px;
        }
        
        .send-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-messages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(76, 175, 80, 0.1);
          border-radius: 50%;
          border-top-color: #4CAF50;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 15px;
        }
        
        .empty-messages, .no-conversation-selected {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          text-align: center;
          padding: 20px;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
          color: #ddd;
        }
        
        .error-message {
          padding: 10px 15px;
          background: #ffebee;
          color: #c62828;
          border-radius: 4px;
          margin: 15px;
          font-size: 14px;
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default MessagingPage;