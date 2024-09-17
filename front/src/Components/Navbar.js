import React from 'react';
import './navbar.css'; // Add the styling for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><a href="#home">About</a></li>
        <li className="nav-item"><a href="#about">Discussion Forrum</a></li>
        <li className="nav-item"><a href="#contact">Contact</a></li>
        <li className="nav-item"><a href="#profile">Account</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
