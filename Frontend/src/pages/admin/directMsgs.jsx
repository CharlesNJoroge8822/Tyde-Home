import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiUser, FiMessageSquare, FiAlertCircle, FiX, FiChevronDown } from 'react-icons/fi';
import { FaUserShield } from 'react-icons/fa';

const AdminMsgs = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState({
    conversations: false,
    messages: false,
    sending: false
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const currentUser = { id: 1, name: 'Admin', is_admin: true };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(prev => ({ ...prev, conversations: true }));
      setError(null);
  
      try {
        const response = await axios.get(`http://127.0.0.1:5000/conversations/${currentUser.id}`);
        if (Array.isArray(response.data)) {
          setConversations(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load conversations.');
        setConversations([]);
      } finally {
        setIsLoading(prev => ({ ...prev, conversations: false }));
      }
    };
  
    fetchConversations(); // Fetch once when component mounts or `currentUser.id` changes
  }, [currentUser.id]); // Dependency ensures re-fetch if `currentUser.id` changes


  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      setIsLoading(prev => ({ ...prev, messages: true }));
      setError(null);
      
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/conversation/${currentUser.id}/${selectedConversation.other_user_id}`
        );
        
        if (response.data && Array.isArray(response.data)) {
          setMessages(response.data);
          // Set polling for new messages in this conversation
          const interval = setInterval(fetchMessages, 5000);
          return () => clearInterval(interval);
        } else {
          throw new Error('Invalid messages format received');
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
        setError('Failed to load messages. Please try again.');
        setMessages([]);
      } finally {
        setIsLoading(prev => ({ ...prev, messages: false }));
      }
    };

    fetchMessages();
  }, [selectedConversation, currentUser.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsLoading(prev => ({ ...prev, sending: true }));
    setError(null);
    
    try {
      await axios.post('http://127.0.0.1:5000/messages', {
        sender_id: currentUser.id,
        recipient_id: selectedConversation.other_user_id,
        content: newMessage
      });
      
      setNewMessage('');
      // Refresh messages
      const response = await axios.get(
        `http://127.0.0.1:5000/conversation/${currentUser.id}/${selectedConversation.other_user_id}`
      );
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, sending: false }));
    }
  };
// blue
  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unread_count || 0), 
    0
  );

  return (
    <div className="font-serif">
      {/* Open Messages Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center bg-blue-700 hover:bg-blue-800 text-blue-50 px-4 py-2 rounded-lg shadow transition-colors"
        disabled={isLoading.conversations}
      >
        {isLoading.conversations ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-50 mr-2"></div>
            Loading...
          </span>
        ) : (
          <>
            Customer Messages
            {totalUnread > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalUnread}
              </span>
            )}
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Messages Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-blue-50 rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col border-2 border-blue-300">
            {/* Modal Header */}
            <div className="border-b border-blue-200 p-4 flex justify-between items-center bg-blue-700 text-blue-50 rounded-t-lg">
              <h2 className="text-xl font-bold">Customer Messages</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-blue-200 overflow-y-auto bg-blue-100">
                <div className="p-3 border-b border-blue-200 bg-blue-700 text-blue-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-full bg-blue-600 text-blue-50 placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <FiChevronDown className="absolute right-3 top-3 text-blue-200" />
                  </div>
                </div>
                {isLoading.conversations ? (
                  <div className="p-4 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <div className="divide-y divide-blue-200">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map(conv => (
                        <div
                          key={conv.other_user_id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedConversation?.other_user_id === conv.other_user_id 
                              ? 'bg-blue-200' 
                              : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-900">
                              {conv.other_user_name}
                            </span>
                            {(conv.unread_count || 0) > 0 && (
                              <span className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-600 truncate">
                            {conv.last_message || 'No messages yet'}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            {new Date(conv.last_message_time).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-blue-600">
                        No conversations found
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Messages Panel */}
              <div className="w-2/3 flex flex-col bg-blue-50">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-b border-blue-200 flex justify-between items-center bg-blue-100">
                      <div className="flex items-center">
                        <FiUser className="text-blue-700 mr-2" />
                        <h3 className="font-semibold text-blue-900">
                          {selectedConversation.other_user_name}
                        </h3>
                      </div>
                      <span className="text-sm text-blue-600">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-blue-50 bg-opacity-70">
                      {isLoading.messages ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-700"></div>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender_id === currentUser.id 
                                ? 'justify-end' 
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                                msg.sender_id === currentUser.id
                                  ? 'bg-blue-700 text-blue-50 rounded-br-none'
                                  : 'bg-blue-200 text-blue-900 rounded-bl-none'
                              }`}
                            >
                              <div className="flex items-center mb-1">
                                {msg.sender_id === currentUser.id ? (
                                  <FaUserShield className="mr-1" />
                                ) : (
                                  <FiUser className="mr-1" />
                                )}
                                <span className="font-semibold text-xs">
                                  {msg.sender_id === currentUser.id ? 'You' : msg.sender_name}
                                </span>
                              </div>
                              <p className="text-sm">{msg.content}</p>
                              <div className={`text-xs mt-1 text-right ${
                                msg.sender_id === currentUser.id 
                                  ? 'text-blue-200' 
                                  : 'text-blue-700'
                              }`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-center items-center h-full text-blue-600">
                          <div className="text-center">
                            <FiMessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No messages in this conversation yet</p>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-3 border-t border-blue-200 bg-blue-100">
                      {error && (
                        <div className="flex items-center bg-red-100 text-red-800 p-2 mb-2 rounded text-sm">
                          <FiAlertCircle className="mr-2" />
                          {error}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-900"
                          rows="2"
                          disabled={isLoading.sending}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isLoading.sending}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            !newMessage.trim() || isLoading.sending
                              ? 'bg-blue-300 cursor-not-allowed text-blue-600'
                              : 'bg-blue-700 hover:bg-blue-800 text-white'
                          }`}
                        >
                          {isLoading.sending ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Sending...
                            </div>
                          ) : 'Send'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-blue-600">
                    {conversations.length > 0
                      ? 'Select a conversation to view messages'
                      : 'No conversations available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMsgs;