import React from 'react';
import { NavLink } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

const SideNavBar = () => {
  const { moduleActive } = useAppStore();

  return (
    <aside className="fixed h-screen w-64 left-0 top-0 pt-24 bg-slate-900/60 backdrop-blur-lg border-r border-white/5 flex flex-col gap-2 p-4 shadow-2xl z-40 hidden lg:flex">
      <div className="mb-6 px-2">
        <h3 className="font-headline text-primary text-[10px] uppercase tracking-widest font-bold">Neural Interface</h3>
        <p className="text-on-surface-variant text-xs">Active Session: {moduleActive}</p>
      </div>
      
      <div className="space-y-1">
        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-transform duration-200 cursor-pointer ${isActive ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">psychology</span>
          <span className="font-medium text-sm">Neural Map</span>
        </NavLink>
        <NavLink to="/anatomy" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-transform duration-200 cursor-pointer ${isActive ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'}`}>
           <span className="material-symbols-outlined">body_system</span>
           <span className="font-medium text-sm">Anatomy</span>
        </NavLink>
        <NavLink to="/terminology" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-transform duration-200 cursor-pointer ${isActive ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">pill</span>
          <span className="font-medium text-sm">Pharmacology</span>
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-transform duration-200 cursor-pointer ${isActive ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">biotech</span>
          <span className="font-medium text-sm">Diagnostics</span>
        </NavLink>
        <div className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-white/5 hover:translate-x-1 transition-transform duration-200 cursor-pointer">
          <span className="material-symbols-outlined">history</span>
          <span className="font-medium text-sm">History</span>
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
        <button className="w-full bg-surface-container-highest border border-primary/20 text-primary py-3 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 hover:bg-primary/10 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          New Simulation
        </button>
        <div className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-white/5 cursor-pointer">
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-medium text-sm">Help Center</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg text-error hover:bg-error/5 hover:translate-x-1 transition-transform cursor-pointer">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-sm">Sign Out</span>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
