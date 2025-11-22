import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthPage && isAuthenticated && (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-8">
                <Link to={isAdmin ? '/admin' : '/home'} className="text-2xl font-black hover:opacity-80 transition">
                  💼 CRM Pro
                </Link>
                
                {/* Navigation Links */}
                <div className="hidden md:flex gap-6">
                  {isAdmin ? (
                    <>
                      <Link to="/admin" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/admin' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📊 Dashboard
                      </Link>
                      <Link to="/admin/users" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/admin/users' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        👥 Users
                      </Link>
                      <Link to="/admin/leads" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/admin/leads' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📌 Leads
                      </Link>
                      <Link to="/admin/analytics" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/admin/analytics' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📈 Analytics
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/home" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/home' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📊 Dashboard
                      </Link>
                      <Link to="/leads" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/leads' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📌 Leads
                      </Link>
                      <Link to="/tasks" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/tasks' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        ✅ Tasks
                      </Link>
                      <Link to="/complaints" className={`font-semibold px-3 py-2 rounded-lg transition duration-200 ${location.pathname === '/complaints' ? 'bg-blue-500' : 'hover:bg-blue-700'}`}>
                        📝 Complaints
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* User info and Logout Button */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold hidden sm:block">{user?.name}</span>
                <Link
                  to="/profile"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 14a6 6 0 1112 0v1H4v-1z" clipRule="evenodd" />
                  </svg>
                  {user?.name || 'Profile'}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition duration-200 transform hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
