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
        <div className={styles.navLeft}>
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
        </div>

        {loggedIn ? (
          <div className={styles.navRight}>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive && 'active'}`}
              to='products'
            >
              Admin
            </NavLink>

            <NavLink
              className={({ isActive }) => `nav-link ${isActive && 'active'}`}
              to='shop/orders'
            >
              Orders
            </NavLink>

            <NavLink
              className={({ isActive }) => `nav-link ${isActive && 'active'}`}
              to='shop/cart'
            >
              Cart
            </NavLink>

            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <NavLink
              className={({ isActive }) => `nav-link ${isActive && 'active'}`}
              to='shop/cart'
            >
              Cart
            </NavLink>
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
