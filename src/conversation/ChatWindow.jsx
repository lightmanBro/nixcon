import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://127.0.0.1:4000');

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/conversations`, { withCredentials: true });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (msg) => {
      if (msg.conversation === conversationId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [conversationId]);

  const sendMessage = () => {
    const newMessage = {
      conversationId,
      sender: 'admin', // Adjust as needed
      content: message
    };

    socket.emit('sendMessage', newMessage);
    setMessage('');
  };

  return (
    <div>
      <h3>Messages</h3>
      <div>
        {messages.map((msg, index) => (
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

export default ChatWindow;
