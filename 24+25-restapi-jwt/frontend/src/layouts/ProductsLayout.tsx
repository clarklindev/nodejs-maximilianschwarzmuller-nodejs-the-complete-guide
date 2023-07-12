import React from 'react';
import { Outlet } from 'react-router-dom';

export const ProductsLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
