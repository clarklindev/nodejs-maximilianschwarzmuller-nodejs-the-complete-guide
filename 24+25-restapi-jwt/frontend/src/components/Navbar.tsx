import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Navbar.module.css';
import { AuthContext } from '../context/AuthContext';
import { logOut } from '../global/helpers/logOut';

export const Navbar = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  const handleLogout = async () => {
    const result = await logOut(); //server
    console.log('result: ', result);
    setLoggedIn(false); //login/logout buttons
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
