import React from 'react';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
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

        <div>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='auth/login'
          >
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
