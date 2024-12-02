'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../api/auth';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SparkBytes
        </Link>
        <nav className="flex items-center space-x-6">
          {user && (
            <>
              <Link href="/map" className="text-gray-700 hover:text-blue-600">
                Map
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
              <Link href="/logout" className="text-gray-700 hover:text-blue-600">
                Logout
              </Link>
            </>
          )}
          {!user && (
            <Link href="/login_student" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
