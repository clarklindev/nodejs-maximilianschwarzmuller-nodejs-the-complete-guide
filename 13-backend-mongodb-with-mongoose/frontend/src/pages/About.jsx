import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../components/Navbar.module.css';

export const About = () => {
  const [user, setUser] = useState('swagfinger');

  if (!user) {
    //disable history - prevents going back
    return (
      <NavLink
        className={styles['nav-link']}
        activeClassName={styles.active}
        to='/'
        replace={true}
      />
    );
  }

  return (
    <div>
      <h2>About</h2>
      {/* simulate user logs out */}
      <button onClick={() => setUser(null)}>logout</button>
    </div>
  );
};
