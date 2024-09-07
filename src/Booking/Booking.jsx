import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css'
const BookCar = () => {
  const [carId, setCarId] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:4000/bookings', {
        carId,
        startLocation,
        endLocation,
        startTime,        
      });
      setMessage('Booking successful!');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Book a Car</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Car ID:</label>
          <input type="text" value={carId} onChange={(e) => setCarId(e.target.value)} required />
        </div>
        <div>
          <label>Start Location:</label>
          <input type="text" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} required />
        </div>
        <div>
          <label>End Location:</label>
          <input type="text" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} required />
        </div>
        <div>
          <label>Start Time:</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        
        <button type="submit">Book Car</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookCar;
