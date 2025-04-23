import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMessaging = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
    sending: false,
  });
  const [error, setError] = useState(null);

  const currentUser = { id: 8, is_admin: true, name: 'Admin' };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user_id);
    }
  }, [selectedConversation]);
  const fetchConversations = async () => {
    setLoading(prev => ({ ...prev, conversations: true }));
    setError(null);
  
    try {
      const token = localStorage.getItem('token'); // adjust if using a state manager like Redux or Context
      if (!token) throw new Error('Unauthorized: No token found');
  
      const res = await axios.get('http://127.0.0.1:5000/admin/conversations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = res.data.conversations || res.data || [];
      if (!Array.isArray(data)) throw new Error('Conversations format invalid');
      setConversations(data);
  
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  };
  
  const fetchMessages = async (userId) => {
    setLoading(prev => ({ ...prev, messages: true }));
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');
  
      const res = await axios.get(`http://127.0.0.1:5000/messages/admin/conversation/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = res.data || [];
      if (!Array.isArray(data)) throw new Error('Messages format invalid');
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };
  

  const handleConversationSelect = (conv) => {
    setSelectedConversation(conv); // Triggers useEffect to fetch messages
    setMessages([]); // Clear old messages to avoid flicker
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
  
    setLoading(prev => ({ ...prev, sending: true }));
    setError(null);
    
    try {
      const token = localStorage.getItem('token'); // grab your JWT token here
  
      const res = await axios.post(
        'http://127.0.0.1:5000/messages',
        {
          sender_id: currentUser.id,
          recipient_id: selectedConversation.user_id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // this is the magic sauce
          }
        }
      );
  
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };
  

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* Left Panel: Conversations */}
      <div style={{ width: '30%', borderRight: '1px solid #ddd' }}>
        <h3>Conversations</h3>
        {loading.conversations ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p>No conversations found</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.user_id}
              onClick={() => handleConversationSelect(conv)}
              style={{
                padding: '10px',
                backgroundColor: selectedConversation?.user_id === conv.user_id ? '#cfe8fc' : '#f9f9f9',
                marginBottom: '8px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <strong>{conv.user_name}</strong>
              <p>{conv.last_message || 'No messages yet'}</p>
              <small>{conv.updated_at || 'Unknown'}</small>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Messages */}
      <div style={{ width: '70%' }}>
        {selectedConversation ? (
          <>
            <h3>Chat with {selectedConversation.user_name}</h3>
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '10px',
                marginBottom: '15px',
              }}
            >
              {loading.messages ? (
                <p>Loading messages...</p>
              ) : messages.length === 0 ? (
                <p>No messages. Start chatting!</p>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id || msg.timestamp}
                    style={{
                      textAlign: msg.sender_id === currentUser.id ? 'right' : 'left',
                      margin: '10px 0',
                    }}
                  >
                    <div><strong>{msg.sender_id === currentUser.id ? 'You' : msg.sender_name}</strong></div>
                    <div>{msg.content}</div>
                    <small>{new Date(msg.timestamp || msg.created_at).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>

            {/* Message Box */}
            <div>
              <textarea
                rows="3"
                value={newMessage}
                disabled={loading.sending}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading.sending || !newMessage.trim()}
              >
                {loading.sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <p>Select a conversation to view messages</p>
        )}
      </div>

      {/* Global Error */}
      {error && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminMessaging;
