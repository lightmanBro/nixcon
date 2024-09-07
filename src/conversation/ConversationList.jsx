import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:4000/conversations', { withCredentials: true });
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div>
      <h3>Conversations</h3>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation._id} onClick={() => onSelectConversation(conversation._id)}>
            {conversation.participants.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
