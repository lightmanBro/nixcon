import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import AdminChat from './conversation/AdminChat';
import UserChatPage from './conversation/UserChatPage';
import BookCar from './Booking/Booking';  // Adjust the import path if necessary
import SendPackage from './Package/Package';  // Adjust the import path if necessary

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/user-chat" element={<UserChatPage />} />
          <Route path="/booking" element={<BookCar />} />
          <Route path="/send-package" element={<SendPackage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
