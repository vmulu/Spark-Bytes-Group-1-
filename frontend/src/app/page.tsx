'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from './api/auth';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center">
        <Image src="/logo.png" alt="SparkBytes Logo" width={150} height={150} priority />
        <h1 className="text-4xl font-bold mt-4">Welcome to SparkBytes!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your resource for finding leftover food from events around campus and reducing food waste.
        </p>
        {!user && (
          <Link
            href="/login_student"
            className="mt-6 inline-block px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Sign In to Get Started
          </Link>
        )}
        {user && (
          <Link
            href="/map"
            className="mt-6 inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Find Food on Campus
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border border-gray-200 rounded-md shadow-sm text-center">
          <h3 className="text-xl font-semibold">Discover Food</h3>
          <p className="text-gray-600 mt-2">
            Browse available food items leftover from campus events. Save money and help reduce food waste.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-md shadow-sm text-center">
          <h3 className="text-xl font-semibold">Find Locations</h3>
          <p className="text-gray-600 mt-2">
            Use our interactive map to find food locations across campus quickly and easily.
          </p>
        </div>
        <div className="p-6 border border-gray-200 rounded-md shadow-sm text-center">
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <p className="text-gray-600 mt-2">
            Sign up for notifications to stay informed when new food becomes available.
          </p>
        </div>
      </section>
    </div>
  );
}
