import React from 'react';

const ProtectedRoute = ({ children }) => {
  // Simply return the children without any authentication check
  return children;
};

export default ProtectedRoute;
