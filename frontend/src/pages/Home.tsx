import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-white">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium mb-6">
          AI-Powered Education Platform
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Create Quizzes in <span className="text-orange-500">Seconds</span>,<br />
          Not Hours
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Generate smart quizzes with AI, manage your classroom, and track student progress, all in one simple platform built for teachers and students.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/register"
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-2xl mb-3">✨</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Generation</h3>
            <p className="text-sm text-gray-500">Generate quiz questions from any topic using Gemini AI. Edit and customize before saving.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Quizzes</h3>
            <p className="text-sm text-gray-500">Host real-time quiz sessions. Students join with a code and compete on a live leaderboard.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-500">Track scores, view question-wise accuracy, and understand student performance at a glance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
