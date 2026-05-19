import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="pb-12 px-6 lg:px-8 font-inter text-gray-900 max-w-7xl mx-auto">
      {/* Welcome */}
      <header className="mb-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-display font-normal text-gray-900 mb-1">Welcome back, Dr. Aris</h1>
            <p className="text-gray-500 text-sm">Your neural synthesis for <span className="text-indigo-600 font-semibold">Endocrinology</span> is 84% complete.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} 
               className="card-panel px-5 py-3 rounded-xl flex items-center gap-3 border-l-4 border-indigo-500">
            <div className="text-right">
              <div className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest mb-0.5">Study Streak</div>
              <div className="text-xl font-semibold text-gray-900">14 Days</div>
            </div>
            <span className="material-symbols-outlined text-indigo-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Recent Focus Areas */}
        <section className="col-span-12">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Focus Areas</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {[
              { tag: 'Cardiology', title: 'Atrial Fibrillation', desc: 'Electrophysiology and Rate Control', color: 'indigo' },
              { tag: 'Neurology', title: 'Synaptic Plasticity', desc: 'Long-term Potentiation Mechanisms', color: 'violet' },
              { tag: 'Pharma', title: 'SGLT2 Inhibitors', desc: 'Renal Clearance & Nephroprotection', color: 'emerald' },
              { tag: 'Radiology', title: 'Contrast MRI', desc: 'Gadolinium Deposition Analysis', color: 'amber' },
            ].map((card, i) => (
              <div key={i} className="min-w-[260px] card-panel p-5 rounded-xl group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className="flex justify-between mb-3">
                  <span className={`bg-${card.color}-50 text-${card.color}-600 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-${card.color}-200`}>{card.tag}</span>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-500 transition-colors text-lg">north_east</span>
                </div>
                <h3 className="text-base font-semibold mb-0.5 text-gray-900">{card.title}</h3>
                <p className="text-xs text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Exam Mastery */}
        <section className="col-span-12 lg:col-span-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Exam Mastery</h2>
          <div className="card-panel-elevated flex-1 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-100" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" strokeWidth="10"></circle>
                <motion.circle 
                   initial={{ strokeDashoffset: 528 }} animate={{ strokeDashoffset: 116 }} transition={{ duration: 1.5, ease: "easeOut" }}
                   cx="96" cy="96" fill="transparent" r="84" stroke="url(#nxGrad)" strokeDasharray="528" strokeLinecap="round" strokeWidth="10">
                </motion.circle>
                <defs>
                  <linearGradient id="nxGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="hsl(239 84% 67%)"></stop>
                    <stop offset="100%" stopColor="hsl(280 80% 60%)"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-semibold text-gray-900">78<span className="text-lg text-indigo-500">%</span></span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Global Rank</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-[10px] text-gray-400 mb-0.5">Accuracy</div>
                <div className="text-lg font-semibold text-indigo-600">92%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-[10px] text-gray-400 mb-0.5">Speed</div>
                <div className="text-lg font-semibold text-violet-600">0.8s</div>
              </div>
            </div>
          </div>
        </section>

        {/* Neural Suggestions */}
        <section className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Neural Suggestions</h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold uppercase border border-indigo-200">AI Optimized</span>
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {[
              { title: 'Cellular Signaling Path', desc: 'Reviewing JAK-STAT and GPCR interactions.', time: '12 min', badge: 'High Yield', badgeColor: 'emerald', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB27_OUl97QB83XYJx2x1qBtBfVPQYrLGYa_J-23RpAsVBNzoqehfGtq_zOpmGaXs0HWqwt6yEUMrhxVebQZGh5tmPxW7CZqbCEE05wmEaHFSLKKWmQMSWLM4Y2MSD2XLlh4YiKkJlYMssq1m729oMdr4lKOgiLVMUToR-wjPhzS0xdV-LtGc9RDhSZJgien_ysD0PpQo82bJx33-voCKbAEAEUHE1FgaS7A8uW6jlLYiENEiK2fBaXIyImr2lzaWpex-BNxrlELTsH' },
              { title: 'Antibiotic Resistance', desc: 'Mechanisms of beta-lactamase evasion.', time: '8 min', badge: 'Gap Detected', badgeColor: 'amber', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9mrMQZAXppSiAnjUzdk0YXgMR00nbmT81hVpyMfIzCN54ZtJ7KKsrAOxdckNqbyt0q2qbWhhpbjzQ5a2-wqPY5MEb3yzu94vb5peUZhQLbgDvQ7PJoCQhsVHAgvytHB5KZgNK8m6GDRXawJ6AD84iZclKy1ORUoA9KY9k4Fks-Hh2Bn3W41rSQ5lTarXx9CtT8W_YgqE0dI8wjHGkA5OZ5KsrBYbbjV_wDAr8P3CGBkrpX5g4ScZEyb94P6IUu9tUmsXVUcKw5zCp' },
              { title: 'Hemodynamics III', desc: 'Advanced fluid dynamics in valve stenosis.', time: '15 min', badge: 'Complex', badgeColor: 'violet', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmD-4xgg7gFFkS3qy_imQ6iuq1jIG-7nHJ5jVM_t9uxLsiP7ncwf64MJTEGQKanLELwqM0T3ox2jPizKpel18TOh5KJm9qTb2n6gfaKwLfERLEhdwQVeg0kbAJSxKpBKvFJo8HX6hNqmmwJrLyao99VjyDoFhfjbtLYPgQuOG5DAX37jw_iC4s-aWc0EA30JUdBjPotTYEWeARZBB3ZeXYYCMyYIBahiqviNVSZc-RUNuf--vOEpfcZJ83sOMk3pEp36LqA8JfjmbR' },
            ].map((item, i) => (
              <div key={i} className="card-panel p-4 rounded-xl flex gap-4 group hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Topic" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.img}/>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] font-medium text-gray-400">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> {item.time}</span>
                    <span className={`flex items-center gap-1 text-${item.badgeColor}-500`}><span className="material-symbols-outlined text-xs">trending_up</span> {item.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="col-span-12 lg:col-span-3 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Activity Log</h2>
          <div className="card-panel flex-1 rounded-2xl p-5 relative overflow-hidden">
            <div className="relative space-y-6">
              <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-indigo-300 via-violet-300 to-transparent"></div>
              
              {[
                { time: '09:12 AM', title: 'Ethics Quiz Completed', desc: 'Score: 100% (Elite Status)', color: 'indigo', icon: 'check_circle', fill: true },
                { time: 'Yesterday', title: '3D Anatomy Explored', desc: '2.5 hours on Cranial Nerves', color: 'violet', icon: 'import_contacts', fill: false },
                { time: '2 Days Ago', title: 'Achievement Unlocked', desc: 'Pharmacology Master Level 4', color: 'emerald', icon: 'military_tech', fill: false },
                { time: 'Scheduled', title: 'Weekly Mock Exam', desc: 'Saturday at 10:00 AM', color: 'gray', icon: 'schedule', fill: false, dim: true },
              ].map((entry, i) => (
                <div key={i} className={`relative pl-7 ${entry.dim ? 'opacity-40' : ''}`}>
                  <div className={`absolute left-0 top-0.5 w-5 h-5 rounded-full bg-${entry.color}-50 border border-${entry.color}-300 flex items-center justify-center z-10`}>
                    <span className={`material-symbols-outlined text-[12px] text-${entry.color}-500`} style={entry.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>{entry.icon}</span>
                  </div>
                  <div className={`text-[10px] font-semibold text-${entry.color}-500 uppercase tracking-wider mb-0.5`}>{entry.time}</div>
                  <div className="text-sm font-medium text-gray-900">{entry.title}</div>
                  <div className="text-xs text-gray-400">{entry.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
