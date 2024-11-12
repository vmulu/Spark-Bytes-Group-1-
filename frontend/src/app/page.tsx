import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <header className="flex flex-col items-start mb-8">
        <h1 className="text-3xl font-bold">Welcome to SparkBytes!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your resource for finding leftover food from events around campus and
          reducing food waste.
        </p>
      </header>

      <section className="flex flex-col items-center gap-4 mb-8">
        <Image
          src="/logo.png" // replace w/ Spark logo
          alt="SparkBytes!" // replace
          width={150}
          height={150}
          priority
        />
        <h2 className="text-2xl font-semibold text-center">
          Join us in the mission to reduce food waste on campus!
        </h2>
        <p className="text-center text-gray-600 max-w-md">
          SparkBytes connects students with free, leftover food from events
          around campus. Find food, reduce waste, and make a difference!
        </p>
        <Link
          href="/find-food"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Find Food on Campus
        </Link>
      </section>

      <section className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 p-4 border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold">Discover Food</h3>
          <p className="text-gray-600">
            Browse available food items leftover from campus events. Save money
            and help reduce food waste.
          </p>
        </div>
        <div className="flex-1 p-4 border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold">Find Locations</h3>
          <p className="text-gray-600">
            Use our interactive map to find food locations across campus quickly
            and easily.
          </p>
        </div>
        <div className="flex-1 p-4 border border-gray-200 rounded-md shadow-sm">
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <p className="text-gray-600">
            Sign up for notifications to stay informed when new food becomes
            available.
          </p>
        </div>
      </section>

      <footer className="mt-8 text-sm text-center">
        <p>Brought to you by Team 1 | SparkBytes © 2024 </p>
      </footer>
    </div>
  );
}
