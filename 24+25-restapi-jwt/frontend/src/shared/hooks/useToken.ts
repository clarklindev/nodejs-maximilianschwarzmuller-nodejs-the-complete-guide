import { useState } from 'react';

export const useToken = () => {
  const [token, setTokenInternal] = useState(() => {
    //set intial state ourself in this function
    return localStorage.getItem('token');
  });

  const setToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setTokenInternal(newToken);
  };

  return [token, setToken];
};
