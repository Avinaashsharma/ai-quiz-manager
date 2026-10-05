import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* Simple inline SVG icons – no deps needed */
const Icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  list: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  join: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

interface BottomNavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const dashboardPath = user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
  const isLoginActive = location.pathname === '/login';

  const teacherItems: BottomNavItem[] = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: Icons.home },
    { to: '/teacher/quizzes', label: 'Quizzes', icon: Icons.list },
    { to: '/teacher/quizzes/create', label: 'Create', icon: Icons.plus },
  ];

  const studentItems: BottomNavItem[] = [
    { to: '/student/dashboard', label: 'Dashboard', icon: Icons.home },
    { to: '/student/attempts', label: 'Attempts', icon: Icons.clock },
    { to: '/student/join', label: 'Join Quiz', icon: Icons.join },
  ];

  const bottomItems = user?.role === 'teacher' ? teacherItems : user?.role === 'student' ? studentItems : [];

  return (
    <>
      {/* ── Top Navbar (unchanged on desktop, brand-only on mobile for logged-in users) ── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-14">
            <Link to={user ? dashboardPath : '/'} className="flex items-center gap-2">
              <span className="text-orange-500 text-xl font-black leading-none">◆</span>
              <span className="font-black text-gray-900 text-lg tracking-tight">AI Quiz Manager</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Mobile-only logout button in top bar */}
                <button
                  onClick={handleLogout}
                  className="sm:hidden flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                >
                  {Icons.logout}
                  <span>Logout</span>
                </button>
                {user.role === 'teacher' && (
                  <>
                    {[{to:'/teacher/dashboard',label:'Dashboard'},{to:'/teacher/quizzes',label:'My Quizzes'},{to:'/teacher/quizzes/create',label:'Create'}].map(({to,label})=>(
                    <Link key={to} to={to} className={`relative text-sm font-medium transition-colors hidden sm:block px-1 py-0.5 ${
                      location.pathname===to ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                    }`}>
                      {label}
                      {location.pathname===to && <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-orange-500 rounded-full"/>}
                    </Link>
                  ))}
                  </>
                )}
                {user.role === 'student' && (
                  <>
                    {[{to:'/student/dashboard',label:'Dashboard'},{to:'/student/attempts',label:'Attempts'},{to:'/student/join',label:'Join Quiz'}].map(({to,label})=>(
                      <Link key={to} to={to} className={`relative text-sm font-medium transition-colors hidden sm:block px-1 py-0.5 ${
                        location.pathname===to ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                      }`}>
                        {label}
                        {location.pathname===to && <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-orange-500 rounded-full"/>}
                      </Link>
                    ))}
                  </>
                )}
                <Link to="/profile" className="hidden md:flex items-center gap-1.5 group">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors font-medium">{user.name?.split(' ')[0]}</span>
                </Link>
                <span className="h-4 w-px bg-gray-200 hidden sm:block mx-1" />
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                >
                  Logout
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all ${
                    isLoginActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation Bar (logged-in users only, below sm) ── */}
      {user && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
          <div className="flex items-stretch justify-around h-12">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-gray-400 active:text-gray-600'
                  }`}
                >
                  {item.icon}
                  <span className={`text-[9px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            {/* Profile / username tab */}
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
                location.pathname === '/profile'
                  ? 'text-orange-600'
                  : 'text-gray-400 active:text-gray-600'
              }`}
            >
              {Icons.user}
              <span className={`text-[9px] leading-tight truncate max-w-[56px] ${location.pathname === '/profile' ? 'font-semibold' : 'font-medium'}`}>
                {user.name?.split(' ')[0]}
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
