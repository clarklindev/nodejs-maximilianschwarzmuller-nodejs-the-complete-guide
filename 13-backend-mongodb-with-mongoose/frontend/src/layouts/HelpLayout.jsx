import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export const HelpLayout = () => {
  return (
    <div>
      <h2>Help</h2>
      <p>lorem ipsum</p>

      <nav>
        <NavLink to='faq'>faq</NavLink>
        <NavLink to='contact'>contact us</NavLink>
      </nav>

      <Outlet />
    </div>
  );
};
