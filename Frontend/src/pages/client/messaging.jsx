import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiAlertCircle, FiChevronLeft } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch current user ID and admin ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          navigate('/login');
          return;
        }
        setCurrentUserId(user.id);

        const adminResponse = await fetch('http://127.0.0.1:5000/get_admin_id');
        const adminData = await adminResponse.json();
        if (!adminResponse.ok) throw new Error(adminData.error || 'Failed to fetch admin ID');
        setAdminId(adminData.admin_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
// blue
  // Fetch messages when IDs are available
  useEffect(() => {
    if (currentUserId && adminId) {
      fetchMessages();
      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUserId, adminId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/conversation/${currentUserId}/${adminId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch messages');
      
      const formattedMessages = data.map(msg => ({
        ...msg,
        sender_name: msg.sender_id === currentUserId ? 'You' : 'Admin'
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: currentUserId,
          recipient_id: adminId,
          content: newMessage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const sentMessage = await response.json();
      setMessages([...messages, {
        ...sentMessage,
        sender_id: currentUserId,
        sender_name: 'You'
      }]);
      setNewMessage('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50 font-serif">
      {/* Header */}
      <div className="bg-blue-800 text-blue-50 p-4 flex items-center shadow-md">
        <button 
          onClick={() => window.history.back()}
          className="mr-4 text-blue-200 hover:text-white"
        >
          <FiChevronLeft size={24} />
        </button>
        <FaUserShield className="text-blue-200 mr-3" size={20} />
        <div>
          <h2 className="text-xl font-bold">Admin Support</h2>
          <p className="text-xs text-blue-200">Typically replies within an hour</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-blue-100 bg-opacity-50">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-blue-800">
            <FiMessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation with our support team</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex mb-4 ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                msg.sender_id === currentUserId 
                  ? 'bg-blue-600 text-blue-50 rounded-tr-none' 
                  : 'bg-blue-200 text-blue-900 rounded-tl-none'
              }`}>
                <div className="flex items-center mb-1">
                  {msg.sender_id === currentUserId ? (
                    <FiUser className="mr-1" />
                  ) : (
                    <FaUserShield className="mr-1" />
                  )}
                  <span className="font-semibold text-xs">
                    {msg.sender_name}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
                <div className={`text-xs mt-1 text-right ${
                  msg.sender_id === currentUserId ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form 
        onSubmit={handleSubmit} 
        className="p-3 bg-blue-100 border-t border-blue-200"
      >
        {error && (
          <div className="flex items-center bg-red-100 text-red-800 p-2 mb-2 rounded text-sm">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            disabled={!currentUserId || !adminId}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || !currentUserId || !adminId}
            className="ml-2 p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 disabled:opacity-50"
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessagePage;