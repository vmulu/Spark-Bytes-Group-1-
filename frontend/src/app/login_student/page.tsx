'use client';

import { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:8000/login';
  }, []);

  return <p>Redirecting to login...</p>;
};

export default LoginPage;
