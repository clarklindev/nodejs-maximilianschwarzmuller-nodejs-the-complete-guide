import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import styles from '../components/Breadcrumbs.module.css';

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
            className={({ isActive }) => `nav-link ${isActive && 'active'}`}
            to={currentLink}
          >
            {crumb}
          </NavLink>
        </div>
      );
    });

  return <div className={styles.breadcrumbs}>{crumbs}</div>;
};
