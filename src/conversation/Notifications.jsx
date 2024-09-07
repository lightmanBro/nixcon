import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Adjust the URL to your server

const AdminResponse = () => {
  const [view, setView] = useState("bookings"); // 'bookings', 'packages', 'confirmed'
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  // Dummy data placeholders

  useEffect(() => {
    // Listen for socket connection
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    // Listen for socket disconnection
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });
    // Initial load with dummy data
    // Listen for new bookings
    socket.on("newBooking", (booking) => {
      alert("New booking has arrived");
      setBookings((prevBookings) => [...prevBookings, booking]);
    });

    // Listen for new packages
    socket.on("newPackage", (packageData) => {
      setPackages((prevPackages) => [...prevPackages, packageData]);
    });

    // Listen for booking confirmations
    socket.on("bookingConfirmed", (booking) => {
      setConfirmedBookings((prevConfirmed) => [...prevConfirmed, booking]);
    });

    // Cleanup the event listeners on component unmount
    return () => {
      socket.off("newBooking");
      socket.off("newPackage");
      socket.off("bookingConfirmed");
    };
  }, []);

  const handleBookingResponse = (bookingId, response) => {
    console.log(`Booking ID: ${bookingId}, Response: ${response}`);
    const booking = bookings.find((b)=>b._id === bookingId);
    socket.emit('bookingApproval',{
      userId:booking.user._id,
      bookingId,
      status:response
    })
    // Handle booking response logic here
  };

  const handlePackageResponse = (packageId, response) => {
    console.log(`Package ID: ${packageId}, Response: ${response}`);
    const packageData = packages.find(p=>p._id === packageId);
    socket.emit('packageResponse',{
      userId:packageData.user._id,
      packageId,
      status:response
    })
    // Handle package response logic here
  };

  return (
    <div>
      <h1>Admin Response</h1>
      <div>
        <button onClick={() => setView('bookings')}>
          New Bookings ({bookings.length})
        </button>
        <button onClick={() => setView('packages')}>
          New Packages ({packages.length})
        </button>
        <button onClick={() => setView('confirmed')}>
          Confirmed Bookings ({confirmedBookings.length})
        </button>
      </div>

      {view === 'bookings' && (
        <>
          <h2>New Bookings</h2>
          {bookings.map((booking) => (
            <div key={booking._id}>
              <p>Booking ID: {booking._id}</p>
              <p>User ID: {booking.user}</p>
              <p>Car ID: {booking.car}</p>
              <button onClick={() => handleBookingResponse(booking._id, 'approve')}>Approve</button>
              <button onClick={() => handleBookingResponse(booking._id, 'reject')}>Reject</button>
            </div>
          ))}
        </>
      )}

      {view === 'packages' && (
        <>
          <h2>New Packages</h2>
          {packages.map((packageData) => (
            <div key={packageData._id}>
              <p>Package ID: {packageData._id}</p>
              <p>User ID: {packageData.user}</p>
              <p>Car ID: {packageData.car}</p>
              <p>Weight: {packageData.weight}</p>
              <p>Dimensions: {packageData.dimensions}</p>
              <button onClick={() => handlePackageResponse(packageData._id, 'approve')}>Approve</button>
              <button onClick={() => handlePackageResponse(packageData._id, 'reject')}>Reject</button>
            </div>
          ))}
        </>
      )}

      {view === 'confirmed' && (
        <>
          <h2>Confirmed Bookings</h2>
          {confirmedBookings.map((booking) => (
            <div key={booking._id}>
              <p>Booking ID: {booking._id}</p>
              <p>User ID: {booking.user}</p>
              <p>Car ID: {booking.car}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminResponse;
