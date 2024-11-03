import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to SparkBytes!</h1>
        <p className="text-center text-lg">
          Your platform for accessing extra food from events around campus.
        </p>
        <Image
          src="/frontend/public/logo.png" //replace
          alt="Spark!" //replace 
          width={150}
          height={150}
          priority
        />
      </main>
      <footer className="mt-8 text-sm text-center">
        <p>Powered by Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}
