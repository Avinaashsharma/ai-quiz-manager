import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          🧠 AI Quiz Manager
        </h1>
        <p className="text-lg text-purple-200 mb-10">
          An AI-powered quiz platform for teachers and students. Generate quizzes
          with AI, manage your classroom, and track progress — all in one place.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/login"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors duration-200 shadow-lg"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
