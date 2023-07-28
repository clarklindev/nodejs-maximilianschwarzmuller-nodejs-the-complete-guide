import React from 'react';
import { Outlet } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <Outlet />
    </div>
  );
};
