import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';

const SideNavBar = () => {
  const { moduleActive } = useAppStore();

  const navLink = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm ${
      isActive
        ? 'bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-white font-medium'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200'
    }`;

  return (
    <aside className="fixed h-screen w-60 left-0 top-0 pt-20
                      bg-white dark:bg-gray-900
                      border-r border-gray-200 dark:border-gray-700/60
                      flex flex-col gap-1 p-4 z-40 hidden lg:flex font-inter
                      transition-colors duration-300">
      <div className="mb-6 px-3">
        <h3 className="text-[10px] uppercase tracking-widest font-semibold text-indigo-600 dark:text-indigo-400">Medical Hub</h3>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Active: {moduleActive}</p>
      </div>

      <div className="space-y-0.5">
        <NavLink to="/dashboard" className={navLink}>
          <span className="material-symbols-outlined text-xl">psychology</span>
          <span>Neural Map</span>
        </NavLink>
        <NavLink to="/anatomy" className={navLink}>
           <span className="material-symbols-outlined text-xl">body_system</span>
           <span>Anatomy</span>
        </NavLink>
        <NavLink to="/terminology" className={navLink}>
          <span className="material-symbols-outlined text-xl">pill</span>
          <span>Pharmacology</span>
        </NavLink>
        <NavLink to="/quiz" className={navLink}>
          <span className="material-symbols-outlined text-xl">biotech</span>
          <span>Diagnostics</span>
        </NavLink>
        <NavLink to="/history" className={navLink}>
          <span className="material-symbols-outlined text-xl">history</span>
          <span>History</span>
        </NavLink>
      </div>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-700/60 pt-4 space-y-1">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-2.5 rounded-full font-medium text-sm mb-3
                     flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Simulation
        </motion.button>
        
        <motion.div 
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => useAppStore.getState().setHelpModalOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-gray-400 dark:text-gray-500
                     hover:bg-gray-50 dark:hover:bg-gray-800/60
                     hover:text-gray-600 dark:hover:text-gray-300
                     cursor-pointer text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
          <span>Help Center</span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            await useAuthStore.getState().signOut();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-rose-400 dark:text-rose-400
                     hover:bg-rose-50 dark:hover:bg-rose-900/20
                     hover:text-rose-600 dark:hover:text-rose-300
                     transition-colors cursor-pointer text-sm"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Sign Out</span>
        </motion.div>
      </div>
    </aside>
  );
};

export default SideNavBar;
