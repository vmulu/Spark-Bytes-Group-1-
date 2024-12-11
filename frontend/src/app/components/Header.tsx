'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../api/auth';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header
      className="text-white shadow-lg"
      style={{ backgroundColor: "#088F8F", marginBottom: "0" }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          SparkBytes
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/map" className="hover:underline">
                Map
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <Link href="/logout" className="hover:underline">
                Logout
              </Link>
            </>
          ) : (
            <Link href="/login_student" className="hover:underline">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
