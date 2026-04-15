import React from 'react';
import GlassPanel from '../components/ui/GlassPanel';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="pb-12 px-8 font-body text-on-surface max-w-7xl mx-auto">
      {/* Welcome Message */}
      <header className="mb-10 relative mt-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-2 tracking-tight">Welcome back, Dr. Aris</h1>
            <p className="text-on-surface-variant font-body text-lg">Your neural synthesis for <span className="text-secondary font-bold">Endocrinology</span> is 84% complete.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} 
               className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border-l-4 border-primary">
            <div className="text-right">
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Study Streak</div>
              <div className="text-2xl font-headline font-bold">14 Days</div>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Recent Searches (Horizontal Cards) */}
        <section className="col-span-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-headline font-semibold text-on-surface">Recent Focus Areas</h2>
            <button className="text-sm text-tertiary font-bold hover:underline">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {/* Focus Card 1 */}
            <div className="min-w-[280px] glass-panel p-5 rounded-2xl group hover:bg-surface-container-highest/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t border-l border-white/5">
              <div className="flex justify-between mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest">Cardiology</span>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">north_east</span>
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">Atrial Fibrillation</h3>
              <p className="text-xs text-on-surface-variant mb-4">Electrophysiology and Rate Control</p>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-surface flex items-center justify-center text-[10px]">AI</div>
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-surface flex items-center justify-center text-[10px]">MD</div>
              </div>
            </div>

            {/* Focus Card 2 */}
            <div className="min-w-[280px] glass-panel p-5 rounded-2xl group hover:bg-surface-container-highest/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t border-l border-white/5">
              <div className="flex justify-between mb-4">
                <span className="bg-secondary/10 text-secondary text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest">Neurology</span>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary transition-colors">north_east</span>
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">Synaptic Plasticity</h3>
              <p className="text-xs text-on-surface-variant mb-4">Long-term Potentiation Mechanisms</p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[65%]"></div>
              </div>
            </div>

            {/* Focus Card 3 */}
            <div className="min-w-[280px] glass-panel p-5 rounded-2xl group hover:bg-surface-container-highest/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t border-l border-white/5">
              <div className="flex justify-between mb-4">
                <span className="bg-tertiary/10 text-tertiary text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest">Pharma</span>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-tertiary transition-colors">north_east</span>
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">SGLT2 Inhibitors</h3>
              <p className="text-xs text-on-surface-variant mb-4">Renal Clearance &amp; Nephroprotection</p>
              <div className="text-[10px] font-bold text-tertiary bg-tertiary/5 px-2 py-1 rounded w-max italic">New Protocol Added</div>
            </div>
            
            {/* Focus Card 4 */}
            <div className="min-w-[280px] glass-panel p-5 rounded-2xl group hover:bg-surface-container-highest/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t border-l border-white/5">
              <div className="flex justify-between mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest">Radiology</span>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">north_east</span>
              </div>
              <h3 className="text-lg font-headline font-bold mb-1">Contrast MRI</h3>
              <p className="text-xs text-on-surface-variant mb-4">Gadolinium Deposition Analysis</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Performance */}
        <section className="col-span-12 lg:col-span-4 flex flex-col">
          <h2 className="text-xl font-headline font-semibold text-on-surface mb-4">Exam Mastery</h2>
          <GlassPanel className="flex-1 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 blur-[80px] rounded-full"></div>
            
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-highest" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeWidth="12"></circle>
                <motion.circle 
                   initial={{ strokeDashoffset: 628 }} animate={{ strokeDashoffset: 138 }} transition={{ duration: 1.5, ease: "easeOut" }}
                   cx="112" cy="112" fill="transparent" r="100" stroke="url(#neuralGradient)" strokeDasharray="628" strokeLinecap="round" strokeWidth="12">
                </motion.circle>
                <defs>
                  <linearGradient id="neuralGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#43f3f6"></stop>
                    <stop offset="100%" stopColor="#ff50fc"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-headline font-bold">78<span className="text-2xl text-primary">%</span></span>
                <span className="text-xs font-body text-on-surface-variant font-medium tracking-widest uppercase">Global Rank</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-on-surface-variant mb-1">Accuracy</div>
                <div className="text-xl font-headline font-bold text-primary">92%</div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5">
                <div className="text-xs text-on-surface-variant mb-1">Speed</div>
                <div className="text-xl font-headline font-bold text-secondary">0.8s</div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* Suggested Topics */}
        <section className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-headline font-semibold text-on-surface">Neural Suggestions</h2>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">AI Optimized</span>
          </div>
          <div className="grid grid-cols-1 gap-4 flex-1">
            <GlassPanel className="p-4 rounded-2xl flex gap-4 group hover:bg-surface-container-highest transition-all duration-300">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img alt="Topic" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB27_OUl97QB83XYJx2x1qBtBfVPQYrLGYa_J-23RpAsVBNzoqehfGtq_zOpmGaXs0HWqwt6yEUMrhxVebQZGh5tmPxW7CZqbCEE05wmEaHFSLKKWmQMSWLM4Y2MSD2XLlh4YiKkJlYMssq1m729oMdr4lKOgiLVMUToR-wjPhzS0xdV-LtGc9RDhSZJgien_ysD0PpQo82bJx33-voCKbAEAEUHE1FgaS7A8uW6jlLYiENEiK2fBaXIyImr2lzaWpex-BNxrlELTsH"/>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">Cellular Signaling Path</h3>
                <p className="text-sm text-on-surface-variant line-clamp-1">Reviewing JAK-STAT and GPCR interactions.</p>
                <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> 12 min</span>
                  <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-xs">trending_up</span> High Yield</span>
                </div>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-4 rounded-2xl flex gap-4 group hover:bg-surface-container-highest transition-all duration-300">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img alt="Topic" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mrMQZAXppSiAnjUzdk0YXgMR00nbmT81hVpyMfIzCN54ZtJ7KKsrAOxdckNqbyt0q2qbWhhpbjzQ5a2-wqPY5MEb3yzu94vb5peUZhQLbgDvQ7PJoCQhsVHAgvytHB5KZgNK8m6GDRXawJ6AD84iZclKy1ORUoA9KY9k4Fks-Hh2Bn3W41rSQ5lTarXx9CtT8W_YgqE0dI8wjHGkA5OZ5KsrBYbbjV_wDAr8P3CGBkrpX5g4ScZEyb94P6IUu9tUmsXVUcKw5zCp"/>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">Antibiotic Resistance</h3>
                <p className="text-sm text-on-surface-variant line-clamp-1">Mechanisms of beta-lactamase evasion.</p>
                <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> 8 min</span>
                  <span className="flex items-center gap-1 text-secondary"><span className="material-symbols-outlined text-xs">error</span> Gap Detected</span>
                </div>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-4 rounded-2xl flex gap-4 group hover:bg-surface-container-highest transition-all duration-300">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img alt="Topic" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmD-4xgg7gFFkS3qy_imQ6iuq1jIG-7nHJ5jVM_t9uxLsiP7ncwf64MJTEGQKanLELwqM0T3ox2jPizKpel18TOh5KJm9qTb2n6gfaKwLfERLEhdwQVeg0kbAJSxKpBKvFJo8HX6hNqmmwJrLyao99VjyDoFhfjbtLYPgQuOG5DAX37jw_iC4s-aWc0EA30JUdBjPotTYEWeARZBB3ZeXYYCMyYIBahiqviNVSZc-RUNuf--vOEpfcZJ83sOMk3pEp36LqA8JfjmbR"/>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-headline font-bold text-on-surface group-hover:text-tertiary transition-colors">Hemodynamics III</h3>
                <p className="text-sm text-on-surface-variant line-clamp-1">Advanced fluid dynamics in valve stenosis.</p>
                <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> 15 min</span>
                  <span className="flex items-center gap-1 text-tertiary"><span className="material-symbols-outlined text-xs">psychology</span> Complex Logic</span>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="col-span-12 lg:col-span-3 flex flex-col">
          <h2 className="text-xl font-headline font-semibold text-on-surface mb-4">Neural Log</h2>
          <GlassPanel className="flex-1 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative space-y-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent opacity-30"></div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest border border-primary flex items-center justify-center neon-glow-primary z-10">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">09:12 AM</div>
                <div className="font-body text-sm font-semibold text-on-surface">Ethics Quiz Completed</div>
                <div className="text-xs text-on-surface-variant">Score: 100% (Elite Status)</div>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest border border-secondary flex items-center justify-center neon-glow-secondary z-10">
                  <span className="material-symbols-outlined text-[14px] text-secondary">import_contacts</span>
                </div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-tighter mb-1">Yesterday</div>
                <div className="font-body text-sm font-semibold text-on-surface">3D Anatomy Explored</div>
                <div className="text-xs text-on-surface-variant">2.5 hours on Cranial Nerves</div>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest border border-tertiary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">military_tech</span>
                </div>
                <div className="text-[10px] font-bold text-tertiary uppercase tracking-tighter mb-1">2 Days Ago</div>
                <div className="font-body text-sm font-semibold text-on-surface">Achievement Unlocked</div>
                <div className="text-xs text-on-surface-variant">Pharmacology Master Level 4</div>
              </div>
              
              <div className="relative pl-8 opacity-50">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[14px] text-slate-500">schedule</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Scheduled</div>
                <div className="font-body text-sm font-semibold text-on-surface">Weekly Mock Exam</div>
                <div className="text-xs text-on-surface-variant">Saturday at 10:00 AM</div>
              </div>
            </div>
          </GlassPanel>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
