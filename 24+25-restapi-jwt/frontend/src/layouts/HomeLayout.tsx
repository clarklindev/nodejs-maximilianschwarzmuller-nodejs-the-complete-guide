import React from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/Navbar';
import styles from './HomeLayout.module.css';

export const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
