import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Invoicing Platform
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/clients"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/clients')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Clients
                </Link>
                <Link
                  to="/invoices"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/invoices')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Invoices
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/users')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(user?.name, user?.email)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700">
                    {user?.name || user?.email}
                  </span>
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                        <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Invoicing Platform</span>
              {' '}— Streamline your invoicing process
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-slate-500">
              © {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
