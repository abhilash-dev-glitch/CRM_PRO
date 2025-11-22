import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, BarChart2, Grid, Mail, Globe, Plus, Briefcase, User, LogOut, Settings } from 'lucide-react';
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
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const userInitials = getUserInitials(user?.name);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && !isAdminPage && isAuthenticated && (
        <div className="bg-secondary text-white px-6 py-3 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b-2 border-primary">
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-2 text-primary group cursor-pointer">
              <Briefcase className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 group-active:rotate-0" />
              <span className="text-2xl font-black tracking-tight text-white transition-all duration-300 group-hover:text-accent group-hover:tracking-wide group-active:scale-95">SwiftCRM</span>
            </Link>
            <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block"></div>
            <h1 className="text-xl font-bold text-gray-300 hidden md:block">
              {location.pathname === '/home' && 'Dashboard'}
              {location.pathname === '/leads' && 'Leads'}
              {location.pathname === '/tasks' && 'Tasks'}
              {location.pathname === '/complaints' && 'Complaints'}
              {location.pathname === '/profile' && 'Profile'}
              {location.pathname.startsWith('/admin') && 'Admin Dashboard'}
              {!['/home', '/leads', '/tasks', '/complaints', '/profile'].includes(location.pathname) && !location.pathname.startsWith('/admin') && 'Overview'}
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Icons - Using Lucide React for consistency */}
            <div className="flex gap-5">
              <Link to="/home" title="Dashboard">
                <BarChart2 className={`h-6 w-6 cursor-pointer transition ${location.pathname === '/home' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`} />
              </Link>
              <Link to="/leads" title="Leads">
                <Grid className={`h-6 w-6 cursor-pointer transition ${location.pathname === '/leads' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`} />
              </Link>
              <Link to="/complaints" title="Complaints">
                <Mail className={`h-6 w-6 cursor-pointer transition ${location.pathname === '/complaints' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`} />
              </Link>
              <Link to="/tasks" title="Tasks">
                <Globe className={`h-6 w-6 cursor-pointer transition ${location.pathname === '/tasks' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`} />
              </Link>
              <Link to="/leads" title="Add New">
                <Plus className="h-8 w-8 cursor-pointer text-white hover:text-accent transition bg-primary rounded-full p-1 shadow-lg hover:shadow-xl hover:scale-110" />
              </Link>
            </div>

            <div className="group relative">
              <div className="h-11 w-11 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 ring-2 ring-primary/30">
                {userInitials}
              </div>
              {/* Enhanced Dropdown */}
              <div className="absolute right-0 mt-3 w-64 bg-card rounded-xl shadow-2xl py-2 z-50 hidden group-hover:block border-2 border-primary/20 backdrop-blur-sm">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-teal-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-150 group/item"
                  >
                    <User className="h-4 w-4 text-gray-400 group-hover/item:text-primary transition-colors" />
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-150 group/item"
                  >
                    <Settings className="h-4 w-4 text-gray-400 group-hover/item:text-primary transition-colors" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="border-t border-primary/10 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 group/item font-medium"
                  >
                    <LogOut className="h-4 w-4 group-hover/item:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
