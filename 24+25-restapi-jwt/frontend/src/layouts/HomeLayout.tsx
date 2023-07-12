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
            to='admin/products'
          >
            Products
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to='testing/upload'
          >
            upload
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
      </Navbar>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
