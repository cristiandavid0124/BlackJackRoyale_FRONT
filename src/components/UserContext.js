// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, userName, setUserName, loadingUser, setLoadingUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
