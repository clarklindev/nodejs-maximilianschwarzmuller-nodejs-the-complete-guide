import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from '../components/Navbar.module.css';

export const HelpLayout = () => {
  return (
    <div>
      <h2>Help</h2>
      <p>lorem ipsum</p>

      <nav>
        <NavLink
          className={styles['nav-link']}
          activeClassName={styles.active}
          to='faq'
        >
          faq
        </NavLink>
        <NavLink
          className={styles['nav-link']}
          activeClassName={styles.active}
          to='contact'
        >
          contact us
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
