'use client';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>Brought to you by Team 1 | SparkBytes © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
