import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Settings, Sun, Moon } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import JAMAAnimatedLogo from './JAMAAnimatedLogo';

const TopNavBar = () => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 lg:px-8 h-16
                    bg-white/80 dark:bg-gray-900/80
                    backdrop-blur-xl
                    border-b border-gray-200 dark:border-gray-700/60
                    font-inter transition-colors duration-300">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">✦ Medix AI</span>
            <span className={`text-[8px] font-bold tracking-[0.18em] uppercase ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
              developed by
            </span>
          </div>
          <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0">
            <JAMAAnimatedLogo size="small" />
          </div>
        </NavLink>
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/dashboard" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-0.5'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`
          }>Dashboard</NavLink>
          <NavLink to="/terminology" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-0.5'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`
          }>Study Library</NavLink>
          <NavLink to="/quiz" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-0.5'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`
          }>Practice Exams</NavLink>
          <NavLink to="/anatomy" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-0.5'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`
          }>Visualizer</NavLink>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-all rounded-lg hidden md:flex">
          <Bell className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-all rounded-lg hidden md:flex">
          <Settings className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative p-0.5 rounded-full transition-all duration-300 hidden md:flex items-center
                     bg-gray-100 dark:bg-gray-800
                     hover:ring-2 hover:ring-indigo-400/50
                     border border-gray-200 dark:border-gray-700"
          style={{ width: '60px', height: '30px' }}
        >
          {/* Track */}
          <span
            className="absolute inset-0 rounded-full transition-colors duration-300"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
                : 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            }}
          />
          {/* Thumb */}
          <span
            className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-md
                       transition-all duration-300 ease-spring"
            style={{
              transform: darkMode ? 'translateX(30px)' : 'translateX(0px)',
              background: darkMode ? '#6366f1' : '#ffffff',
            }}
          >
            {darkMode
              ? <Moon className="w-3 h-3 text-white" />
              : <Sun className="w-3 h-3 text-indigo-500" />
            }
          </span>
        </button>

        {/* Go Pro */}
        <button className="px-5 py-2 bg-gray-900 dark:bg-indigo-600 text-white font-medium text-sm
                           rounded-full hover:bg-gray-800 dark:hover:bg-indigo-500
                           transition-colors whitespace-nowrap ml-1">
          Go Pro
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600
                        hover:border-gray-400 dark:hover:border-gray-400 transition-colors cursor-pointer shrink-0">
          <img alt="User Avatar" className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1KrY3hAzs_b3mzGZkIzfzajdRzqAwyBk7b4QN7QmFTzfWyf7022-UjIx-ESAbie6iLUdWeK8xqKYZ-O4rkxzX_fazXz7rDV1E-tcBOq3RWgLgroK7ttKkFLA_Dki6uESzgYqFdHmy6yCyZiwDspQlEbGiX5gUoYb3WAQqX4Ce4vgczdtoQcaRgRwtHYldy5qr6MLeKizq_v6FmJENfhI9iQozpmU5KaewI-Q_wn04vlOv--wO7-w_j5sLRS4SC1VbZGjXlwq5xYm" />
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
