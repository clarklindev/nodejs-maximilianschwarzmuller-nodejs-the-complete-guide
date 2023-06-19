import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import styles from '../components/Navbar.module.css';

export const Breadcrumbs = () => {
  const location = useLocation();

  let currentLink = '';

  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`;

      return (
        <div className='crumb' key={crumb}>
          <NavLink
            className={styles['nav-link']}
            activeClassName={styles.active}
            to={currentLink}
          >
            {crumb}
          </NavLink>
        </div>
      );
    });

  return <div className='breadcrumbs'>{crumbs}</div>;
};
