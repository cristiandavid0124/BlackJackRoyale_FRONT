import React, { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Memoizing the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    userId,
    setUserId,
    userName,
    setUserName,
    loadingUser,
    setLoadingUser
  }), [userId, userName, loadingUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Prop validation for the UserProvider component
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensures that children are passed as a valid React node
};
