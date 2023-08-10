import React, { useState, createContext, useEffect } from 'react';
import { checkTokenValidity } from '../lib/helpers/checkTokenValidity';

interface AuthContextData {
  loggedIn: boolean;
  setLoggedIn: (val: Boolean) => {};
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider: React.FC = (props) => {
  const token = localStorage.getItem('token');
  const isTokenValid = token ? checkTokenValidity(token) : false;

  if (!isTokenValid) {
    localStorage.setItem('token', ''); //also clear token
  }

  const [loggedIn, setLoggedIn] = useState(isTokenValid); // Initialize loggedIn with a default value of false

  const stuffToShare = {
    loggedIn,
    setLoggedIn,
  };

  return (
    <AuthContext.Provider value={stuffToShare}>
      {props.children}
    </AuthContext.Provider>
  );
};
