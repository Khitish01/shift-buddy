'use client';

import React from 'react';
import './NoBookings.css'; // if you're using global CSS

const NoBookings = () => {
  return (
    <div className="booking-container">
      <div className="booking-line">
        <div className="booking-text">No Bookings</div>
      </div>
    </div>
  );
};

export default NoBookings;
