import React from 'react';
import './Navbar.css';

const Navbar = ({ onMenuClick, isOpen }) => {
  return (
    <div className={`floating-nav-container ${isOpen ? 'sidebar-open' : ''}`}>
      <button className="menu-btn floating-menu-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
         <i className="fas fa-bars" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default Navbar;