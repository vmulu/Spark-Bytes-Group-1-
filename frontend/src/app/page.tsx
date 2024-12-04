'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from './api/auth';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Banner */}
      <div className="flex items-center justify-center w-40 h-40 rounded-full shadow-lg overflow-hidden">
        <Image
          src="/logo.png"
          alt="BU Campus Banner"
          width={200}
          height={200}
          className="w-auto h-auto"
          priority
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-blue-600 mb-4">
          Welcome to SparkBytes
        </h1>
        <p className="text-lg text-center text-gray-700 mb-8">
          Your resource for finding leftover food from events and reducing waste.
        </p>
        {!user ? (
          <div className="text-center">
            <Link
              href="/login_student"
              className="inline-block px-10 py-4 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition"
            >
              Sign In to Get Started
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link
              href="/map"
              className="inline-block px-10 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
            >
              Find Food on Campus
            </Link>
          </div>
        )}
        <section className="mt-16">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6">About the Project</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            SparkBytes is dedicated to connecting students with leftover food from campus events,
            reducing food waste, and helping students save money.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our goal is to make it easy for students to discover available food, find locations
            quickly, and stay updated with notifications.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6">How It Works</h2>
          <p className="text-gray-700 leading-relaxed">
            Event organizers can post food that’s available, and students can quickly find the
            locations on our interactive map. Once you’re signed in, you’ll also receive
            notifications whenever new food becomes available nearby.
          </p>
        </section>
      </main>
    </div>
  );
}
