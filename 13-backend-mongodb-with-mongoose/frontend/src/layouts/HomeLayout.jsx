import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Navbar } from '../components/Navbar';
import styles from '../components/Navbar.module.css';

export const HomeLayout = () => {
  return (
    <>
      <Navbar>
        <header>
          <nav>
            <NavLink
              className={styles['nav-link']}
              activeClassName={styles.active}
              to='/'
            >
              Home
            </NavLink>
            <NavLink
              className={styles['nav-link']}
              activeClassName={styles.active}
              to='about'
            >
              About
            </NavLink>
            <NavLink
              className={styles['nav-link']}
              activeClassName={styles.active}
              to='help'
            >
              Help
            </NavLink>
            <NavLink
              className={styles['nav-link']}
              activeClassName={styles.active}
              to='todos'
            >
              Todos
            </NavLink>
          </nav>
        </header>
      </Navbar>
      <Breadcrumbs />

      <main>
        <Outlet />
      </main>
    </>
  );
};
