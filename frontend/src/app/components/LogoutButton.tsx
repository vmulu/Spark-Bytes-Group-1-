'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext, logout } from '../api/auth';

const LogoutButton = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    router.push('/login_student');
  };

  if (!user) {
    return null;
  }

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
