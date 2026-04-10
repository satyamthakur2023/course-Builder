import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import LoadingSpinner from './LoadingSpinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, checkSession } = useAuthStore();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      if (isAuthenticated) {
        setIsChecking(true);
        try {
          await checkSession();
        } catch (error) {
          console.log('Session check failed:', error);
        }
        setIsChecking(false);
      }
    };

    validateSession();
  }, [isAuthenticated, checkSession]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Validating session..." />
      </div>
    );
  }

  return children;
};

export default AuthGuard;