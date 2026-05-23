import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';

const MainLayout = () => {
    const location = useLocation();
    const isAnatomy = location.pathname.includes('anatomy');
    const isGraph = location.pathname.includes('graph');
    const isFullScreen = isAnatomy || isGraph;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-inter transition-colors duration-300">
      <TopNavBar />
      {!isFullScreen && <SideNavBar />}

      {/* Adjust margin based on whether it is a full screen visualizer or not */}
      <div className={!isFullScreen ? "lg:ml-60 pt-16" : ""}>
         <Outlet />
      </div>

      {/* Mobile BottomNavBar */}
      {!isFullScreen && (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full h-14
                        bg-white/90 dark:bg-gray-900/90
                        backdrop-blur-xl
                        border-t border-gray-200 dark:border-gray-700/60
                        flex items-center justify-around z-50
                        transition-colors duration-300">
            <button className="flex flex-col items-center gap-0.5 text-gray-900 dark:text-white">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                <span className="text-[10px] font-medium">Dash</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-xl">auto_stories</span>
                <span className="text-[10px] font-medium">Learn</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-xl">quiz</span>
                <span className="text-[10px] font-medium">Quiz</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="text-[10px] font-medium">Profile</span>
            </button>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
