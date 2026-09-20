import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <h1 className="text-8xl font-bold text-purple-400 mb-4">404</h1>
      <p className="text-xl text-purple-200 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
