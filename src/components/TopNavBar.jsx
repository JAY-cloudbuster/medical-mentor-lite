import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-8">
        <NavLink to="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent font-headline tracking-tight">MEDIX AI</span>
        </NavLink>
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/dashboard" className={({ isActive }) => `font-headline tracking-tight transition-colors text-sm font-medium ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-white'}`}>Dashboard</NavLink>
          <NavLink to="/terminology" className={({ isActive }) => `font-headline tracking-tight transition-colors text-sm font-medium ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-white'}`}>Study Library</NavLink>
          <NavLink to="/quiz" className={({ isActive }) => `font-headline tracking-tight transition-colors text-sm font-medium ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-white'}`}>Practice Exams</NavLink>
          <NavLink to="/anatomy" className={({ isActive }) => `font-headline tracking-tight transition-colors text-sm font-medium ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-slate-400 hover:text-white'}`}>Visualizer</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2 mr-4 hidden md:flex">
          <button className="p-2 text-slate-400 hover:bg-white/5 transition-all duration-300 rounded-lg">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-400 hover:bg-white/5 transition-all duration-300 rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold rounded-lg active:scale-95 transition-transform shadow-[0_0_20px_rgba(67,243,246,0.3)] hover:shadow-[0_0_30px_rgba(67,243,246,0.5)] whitespace-nowrap">
          Go Pro
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors cursor-pointer shrink-0">
          <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1KrY3hAzs_b3mzGZkIzfzajdRzqAwyBk7b4QN7QmFTzfWyf7022-UjIx-ESAbie6iLUdWeK8xqKYZ-O4rkxzX_fazXz7rDV1E-tcBOq3RWgLgroK7ttKkFLA_Dki6uESzgYqFdHmy6yCyZiwDspQlEbGiX5gUoYb3WAQqX4Ce4vgczdtoQcaRgRwtHYldy5qr6MLeKizq_v6FmJENfhI9iQozpmU5KaewI-Q_wn04vlOv--wO7-w_j5sLRS4SC1VbZGjXlwq5xYm"/>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
