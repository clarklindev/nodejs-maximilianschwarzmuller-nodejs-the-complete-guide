import React from 'react';
import { Outlet } from 'react-router-dom';

export const TodosLayout = () => {
  return (
    <div>
      <h2>Todos: </h2>
      <Outlet />
    </div>
  );
};
