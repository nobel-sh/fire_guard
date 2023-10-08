import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Left side of the navbar with a logo and text */}
      <div className="navbar-left">
        <Link to="/"> {/* This Link component will navigate to the root URL "/" */}
          <img src="https://i.ibb.co/Rhr07hg/image-removebg-preview-1.png" alt="FireGuard Logo" />
        </Link>
        <h2>FIREGUARD</h2>
      </div>

      {/* Right side of the navbar with Admin button */}
      <div className="navbar-right">
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
};

export default Navbar;
