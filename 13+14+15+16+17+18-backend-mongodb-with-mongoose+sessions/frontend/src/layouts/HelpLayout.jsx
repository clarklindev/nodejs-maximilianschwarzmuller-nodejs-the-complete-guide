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
          faq
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${styles['nav-link']} ${styles['active']}`
              : styles['nav-link']
          }
          to='contact'
        >
          contact us
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
