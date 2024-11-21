'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './api/auth';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login_student');
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return null; // Return null or a fallback UI while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
