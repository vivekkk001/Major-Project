import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input type="text" placeholder="Name" />
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Signup</button>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}