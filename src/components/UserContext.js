// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};