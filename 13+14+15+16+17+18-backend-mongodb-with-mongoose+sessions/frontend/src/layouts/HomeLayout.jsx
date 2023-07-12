import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Navbar } from '../components/Navbar';
import styles from './HomeLayout.module.css';

export const HomeLayout = () => {
  return (
    <>
      <Navbar>
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
            to='todos'
          >
            Todos
          </NavLink>
        </div>
        <div>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='login'
          >
            Login
          </NavLink>
        </div>
      </Navbar>
      <Breadcrumbs />

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
