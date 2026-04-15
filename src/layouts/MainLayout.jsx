import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';

const MainLayout = () => {
    const location = useLocation();
    const isAnatomy = location.pathname.includes('anatomy');

  return (
    <div className={`min-h-screen ${isAnatomy ? '' : 'neural-gradient-bg'}`}>
      <TopNavBar />
      {!isAnatomy && <SideNavBar />}
      
      {/* Anatomy has its own background styling */}
      {isAnatomy && (
        <>
            <div className="fixed inset-0 neural-gradient -z-20"></div>
            <div className="fixed inset-0 floating-nebula -z-10"></div>
        </>
      )}

      {/* Adjust margin based on whether it is a full screen visualizer or not */}
      <div className={!isAnatomy ? "lg:ml-64 pt-20" : ""}>
         <Outlet />
      </div>

      {/* Mobile BottomNavBar */}
      {!isAnatomy && (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50">
            <button className="flex flex-col items-center gap-1 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                <span className="text-[10px] font-bold">Dash</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
                <span className="material-symbols-outlined">auto_stories</span>
                <span className="text-[10px] font-bold">Learn</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
                <span className="material-symbols-outlined">quiz</span>
                <span className="text-[10px] font-bold">Quiz</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-bold">Profile</span>
            </button>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
