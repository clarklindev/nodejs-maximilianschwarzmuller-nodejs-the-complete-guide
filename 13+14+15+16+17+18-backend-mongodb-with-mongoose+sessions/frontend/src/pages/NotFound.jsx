import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div>
      <h2>not found</h2>
      <p>
        go to <Link to='/'>home page</Link>
      </p>
    </div>
  );
};
