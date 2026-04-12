import React, { useState, useEffect, useContext } from 'react';
import { listConversations } from '../api/messages';
import { AuthContext } from '../context/AuthContext';
import ChatModal from './ChatModal';

const ChatIcon = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (showDropdown) {
      loadConversations();
    }
  }, [showDropdown]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await listConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    setShowDropdown(false);
  };

  return (
    <>
      <div className="relative">
        {/* Chat Icon Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 text-gray-600 hover:text-cyan-500 transition"
          title="Messages"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {conversations.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {conversations.length}
            </span>
          )}
        </button>

        {/* Dropdown Conversations List */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-40 border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            </div>

            {/* Conversations List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <p>Loading...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectChat(conv)}
                    className="w-full px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-left transition flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <img
                        src={conv._id?.profilePicture || 'https://via.placeholder.com/40'}
                        alt={conv._id?.name}
                        className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {conv._id?.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-cyan-500 rounded-full flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <ChatModal
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          otherUserId={selectedChat._id?._id}
          otherUserName={selectedChat._id?.name}
          otherUserPicture={selectedChat._id?.profilePicture}
          onMessageSent={() => loadConversations()}
        />
      )}
    </>
  );
};

export default ChatIcon;
