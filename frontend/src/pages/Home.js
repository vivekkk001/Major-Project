import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Complaint Portal</h1>
      <Link to="/my-complaints">
        <button>My Complaints</button>
      </Link>
    </div>
  );
}