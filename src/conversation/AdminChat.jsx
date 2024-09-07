import React, { useState } from 'react';
import ConversationsList from './ConversationList';
import ChatWindow from './ChatWindow';
import Notifications from './Notifications'
const AdminChat = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Notifications/>
      <div style={{ width: '30%' }}>
        <ConversationsList onSelectConversation={handleSelectConversation} />
      </div>
      <div style={{ width: '70%' }}>
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} />
        ) : (
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
