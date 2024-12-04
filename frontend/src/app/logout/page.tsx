'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/api/auth';

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push('/');
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
};

export default LogoutPage;