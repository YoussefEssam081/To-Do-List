import React from 'react';
import './Navbar.css';

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1 className='navbar-title'>To-Do List</h1>
            </div>
            <div className="navbar-links-container">
                <div className="navbar-links">
                    <a href="#home">Home</a>
                    <a href="#tasks">Tasks</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <a href="#services">Services</a>
                    <a href="#faq">FAQ</a>
                </div>
            </div>
            <div className={`toggle-switch ${isDarkMode ? 'toggle-switch-on' : 'toggle-switch-off'}`} onClick={toggleDarkMode}>
                <div className={`switch ${isDarkMode ? 'switch-on' : 'switch-off'}`}></div>
            </div>
        </nav>
    );
};

export default Navbar;
