import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './Navbar.module.css';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggedIn(false);
    localStorage.setItem('token', '');
    navigate('/');
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='/'
          >
            Home
          </NavLink>

          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='about'
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='help'
          >
            Help
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='products'
          >
            Products
          </NavLink>

          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='orders'
          >
            Orders
          </NavLink>
        </div>

        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <div>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive && 'active'}`}
              to='auth/login'
            >
              Login
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};
