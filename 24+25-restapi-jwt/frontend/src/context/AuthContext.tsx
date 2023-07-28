import React, { useState, createContext } from 'react';

interface AuthContextData {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthContextProvider: React.FC = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);

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
