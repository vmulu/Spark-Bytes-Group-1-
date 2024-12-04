'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-700">
        <p>Brought to you by Team 1 | SparkBytes © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
