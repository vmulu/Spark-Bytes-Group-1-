'use client';

import { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    // Redirect to your authentication provider
    window.location.href = 'http://localhost:8000/login';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to login...</p>
    </div>
  );
};

export default LoginPage;
