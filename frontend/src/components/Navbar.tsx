import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const dashboardPath = user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to={user ? dashboardPath : '/'} className="flex items-center gap-2">
            <span className="text-orange-500 text-xl font-bold">◆</span>
            <span className="font-bold text-gray-900 text-lg">QuizAI</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'teacher' && (
                <>
                  <Link to="/teacher/quizzes" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                    My Quizzes
                  </Link>
                  <Link to="/teacher/quizzes/create" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                    Create
                  </Link>
                </>
              )}
              {user.role === 'student' && (
                <Link to="/student/join" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                  Join Quiz
                </Link>
              )}
              <span className="text-sm text-gray-400 hidden md:block">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
