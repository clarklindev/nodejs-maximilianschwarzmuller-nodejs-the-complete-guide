import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

export const About = () => {
  const [user, setUser] = useState('swagfinger');

  if (!user) {
    //disable history - prevents going back
    return <Navigate to='/' replace={true} />;
  }

  return (
    <div>
      <h2>About</h2>
      {/* simulate user logs out */}
      <button onClick={() => setUser(null)}>logout</button>
    </div>
  );
};
