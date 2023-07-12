import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './HelpLayout.module.css';

export const HelpLayout = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles['nav-link']} ${styles['active']}`
              : styles['nav-link']
          }
          to='faq'
        >
          <h2>faq</h2>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles['nav-link']} ${styles['active']}`
              : styles['nav-link']
          }
          to='contact'
        >
          <h2>contact us</h2>
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
