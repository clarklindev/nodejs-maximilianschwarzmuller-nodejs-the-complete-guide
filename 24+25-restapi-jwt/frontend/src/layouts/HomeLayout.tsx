import React, { useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/Navbar';
import styles from './HomeLayout.module.css';
import { AuthContext } from '../context/AuthContext';

export const HomeLayout = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  const checkIfUserIsAuthenticated = async () => {
    console.log('FUNCTION checkIfUserIsAuthenticated');

    const url = `${import.meta.env.VITE_BACKEND_URL}:${
      import.meta.env.VITE_BACKEND_PORT
    }/auth/validatetoken`;

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await result.json();
      const { loggedIn } = data;
      console.log('loggedIn:', loggedIn);
      setLoggedIn(loggedIn);
    } catch (error) {
      // Handle fetch errors
      console.error('Error checking authentication:', error);
    }
  };

  useEffect(() => {
    //check if authenticated (on server)
    checkIfUserIsAuthenticated();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
