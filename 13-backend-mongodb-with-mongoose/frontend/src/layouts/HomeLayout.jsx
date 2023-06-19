import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const HomeLayout = () => {
  return (
    <>
      <header>
        <nav>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='about'>About</NavLink>
          <NavLink to='help'>Help</NavLink>
          <NavLink to='todos'>Todos</NavLink>
        </nav>
        <Breadcrumbs />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};
