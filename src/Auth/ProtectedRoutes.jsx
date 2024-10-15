// ProtectedRoutes.js
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem('token');
  const ability = localStorage.getItem('ability');
  const location = useLocation();
  const [lastLocation, setLastLocation] = useState(null);

  useEffect(() => {
    if (!token) {
      setLastLocation(location.pathname);
    }
  }, [token, location]);

  if (!token) {
    if (ability !== 'user') {
      return <Navigate to="/login" state={{ from: lastLocation }} replace />;
    } else {
      return <Navigate to={lastLocation} replace />;
    }
  }

  // If the token exists, allow access to the protected route
  return children;
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoutes;
