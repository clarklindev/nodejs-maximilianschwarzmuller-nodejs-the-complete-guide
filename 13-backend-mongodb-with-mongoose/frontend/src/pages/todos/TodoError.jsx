import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

export const TodoError = () => {
  const error = useRouteError();

  return (
    <div>
      <h2>error</h2>
      <p>{error.message}</p>
      <Link to='/'>back to homepage</Link>
    </div>
  );
};
