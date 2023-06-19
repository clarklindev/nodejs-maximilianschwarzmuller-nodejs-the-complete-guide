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
          <NavLink className='nav-link' activeClassName='active' to='/'>
            Home
          </NavLink>
          <NavLink className='nav-link' activeClassName='active' to='about'>
            About
          </NavLink>
          <NavLink className='nav-link' activeClassName='active' to='help'>
            Help
          </NavLink>
          <NavLink className='nav-link' activeClassName='active' to='todos'>
            Todos
          </NavLink>
        </div>
        <div>
          <NavLink className='nav-link' activeClassName='active' to='login'>
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
