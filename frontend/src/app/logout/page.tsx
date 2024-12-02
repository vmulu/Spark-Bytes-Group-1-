'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {logout} from "@/app/api/auth";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
};

export default LogoutPage;
