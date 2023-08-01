import React, { useState, createContext, useEffect } from 'react';
import { checkTokenValidity } from '../global/helpers/checkTokenValidity';

interface AuthContextData {
  loggedIn: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthContextProvider: React.FC = (props) => {
  const token = localStorage.getItem('token');
  const isTokenValid = token ? checkTokenValidity(token) : false;

  if (!isTokenValid) {
    localStorage.setItem('token', ''); //also clear token
  }

  const [loggedIn, setLoggedIn] = useState(isTokenValid); // Initialize loggedIn with a default value of false

  const stuffToShare: AuthContextData = {
    loggedIn,
    setLoggedIn,
  };

  return (
    <AuthContext.Provider value={stuffToShare}>
      {props.children}
    </AuthContext.Provider>
  );
};
