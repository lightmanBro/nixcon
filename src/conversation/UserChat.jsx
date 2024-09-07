// src/conversation/UserChat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

const UserChat = () => {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get('/user/conversation', { withCredentials: true });
        setConversation(response.data);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();

    socket.on('receiveMessage', (msg) => {
      if (msg.conversation === conversation?._id) {
        setConversation((prevConversation) => ({
          ...prevConversation,
          messages: [...prevConversation.messages, msg]
        }));
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [conversation]);

  const sendMessage = () => {
    const newMessage = {
      conversationId: conversation._id,
      sender: 'user', // Adjust as needed
      content: message
    };

    socket.emit('sendMessage', newMessage);
    setMessage('');
  };

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Conversation with Admin</h3>
      <div>
        {conversation.messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default UserChat;
