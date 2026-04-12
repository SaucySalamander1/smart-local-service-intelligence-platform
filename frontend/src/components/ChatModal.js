import React, { useState, useEffect, useRef, useContext } from 'react';
import { sendMessage, getConversation } from '../api/messages';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

const ChatModal = ({ isOpen, onClose, otherUserId, otherUserName, otherUserPicture, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.io connection
  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.io');
        // Join user's room
        socket.emit('join', user?.id);
      });

      socket.on('receiveMessage', (data) => {
        setMessages(prev => [...prev, {
          senderId: { _id: data.senderId },
          receiverId: { _id: data.receiverId },
          message: data.message,
          timestamp: new Date(data.timestamp)
        }]);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io');
      });

      socketRef.current = socket;
    }

    return () => {
      // Cleanup is handled when component unmounts
    };
  }, [user?.id]);

  // Load conversation when modal opens
  useEffect(() => {
    if (isOpen && otherUserId) {
      loadConversation();
    }
  }, [isOpen, otherUserId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const data = await getConversation(otherUserId);
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Send message to database
      await sendMessage(otherUserId, messageText);
      
      // Emit via Socket.io for real-time delivery
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          senderId: user?.id,
          receiverId: otherUserId,
          message: messageText.trim(),
          timestamp: new Date()
        });
      }

      setMessageText('');
      setError('');
      
      // Reload conversation to ensure we have the latest
      await loadConversation();
      
      // Call callback to refresh conversations list
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCurrentUserSender = (senderObj) => {
    return senderObj?._id === user?.id;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-cyan-500 text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <img
              src={otherUserPicture || 'https://via.placeholder.com/40'}
              alt={otherUserName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{otherUserName}</h2>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-cyan-600 rounded-full p-1 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isFromCurrentUser = isCurrentUserSender(msg.senderId);
              return (
                <div
                  key={index}
                  className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                      isFromCurrentUser
                        ? 'bg-cyan-500 text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs ${isFromCurrentUser ? 'text-cyan-100' : 'text-gray-600'} mt-1`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !messageText.trim()}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
