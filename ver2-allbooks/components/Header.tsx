
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import SyncStatus from './SyncStatus';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-white/20">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <NavLink to="/" className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500 dark:text-sky-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              AllBooks
            </h1>
          </NavLink>
          <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <SyncStatus />
            <ThemeToggle />
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-slate-800 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base ${
                  isActive ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                }`
              }
            >
              Public
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `text-slate-800 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base ${
                      isActive ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                    }`
                  }
                >
                  Admin
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
               <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-slate-800 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base ${
                      isActive ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                    }`
                  }
                >
                  Admin
                </NavLink>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
