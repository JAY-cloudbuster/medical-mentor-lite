import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassPanel from '../components/ui/GlassPanel';
import useAppStore from '../store/useAppStore';

const QuizConfigurator = () => {
    const navigate = useNavigate();
    const { setQuizConfig, resetQuizState } = useAppStore();
    
    const [topic, setTopic] = useState('Pathology');
    const [diff, setDiff] = useState('Medium');
    const [time, setTime] = useState(10); // in minutes
    
    const handleStart = () => {
        const numQuestions = Math.max(1, Math.floor(time / (diff === 'Easy' ? 1 : diff === 'Hard' ? 2 : 1.5)));
        
        setQuizConfig({ topic, difficulty: diff, timeLimit: time, numQuestions });
        resetQuizState();
        navigate('/quiz/engine');
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-body text-on-surface pt-28 px-8 max-w-7xl mx-auto flex gap-8 flex-col lg:flex-row">
            {/* Left Col: Config */}
            <div className="flex-1 space-y-6">
                <h1 className="text-4xl font-headline font-bold glowing-underline mb-8">Exam Configuration</h1>
                
                <GlassPanel className="p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl pointer-events-none rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    
                    <label className="block text-xs font-bold text-secondary tracking-widest uppercase mb-3">Topic Search</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-2xl py-4 px-6 text-on-surface focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-body text-lg mb-4"
                        placeholder="e.g. Cardiology, Action Potentials..."
                    />
                    
                    {/* Explanation of LLM Preparation */}
                    <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">auto_spark</span>
                        <p className="text-xs text-on-surface-variant font-light leading-relaxed">
                            <strong>How the AI prepares your quiz:</strong> The neural engine scans medical contexts to compile original, challenging scenarios focused on <em>{topic || 'your topic'}</em>. It intelligently adjusts the clinical complexity and length to match your difficulty constraints.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-primary tracking-widest uppercase mb-3">Difficulty Level</label>
                            <div className="relative">
                                <select 
                                    value={diff}
                                    onChange={(e) => setDiff(e.target.value)}
                                    className="w-full appearance-none bg-surface-container border border-outline-variant rounded-2xl py-4 px-6 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-on-surface cursor-pointer"
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-tertiary tracking-widest uppercase mb-3">Time to Complete</label>
                            <div className="relative">
                                <select 
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="w-full appearance-none bg-surface-container border border-outline-variant rounded-2xl py-4 px-6 focus:border-tertiary focus:outline-none focus:ring-4 focus:ring-tertiary/10 transition-all text-on-surface cursor-pointer"
                                >
                                    <option value={5}>5 Minutes</option>
                                    <option value={10}>10 Minutes</option>
                                    <option value={15}>15 Minutes</option>
                                    <option value={30}>30 Minutes</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                <button 
                    onClick={handleStart}
                    className="w-full py-5 mt-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-headline text-xl font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(67,243,246,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    Start Exam ({Math.max(1, Math.floor(time / (diff === 'Easy' ? 1 : diff === 'Hard' ? 2 : 1.5)))} Qs)
                    <span className="material-symbols-outlined text-white">rocket_launch</span>
                </button>
            </div>

            {/* Right Col: Info */}
            <div className="lg:w-[350px]">
                <GlassPanel className="p-8 rounded-[2rem] h-full border border-white/5 bg-surface-container-high/40 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] pointer-events-none rounded-full translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex items-center gap-4 text-secondary mb-8">
                        <span className="material-symbols-outlined text-4xl">psychology</span>
                        <h2 className="text-xl font-headline font-bold uppercase tracking-tight">Neural Engine</h2>
                    </div>
                    
                    <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8">
                        MEDIX AI creates highly customized quiz scenarios using advanced reasoning loops. Questions are dynamically compiled to match your parameters on-the-fly.
                    </p>
                    
                    <ul className="space-y-6 text-sm text-on-surface-variant flex-1">
                        <li className="flex gap-4">
                            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">check_circle</span>
                            <div>
                                <span className="text-on-surface font-bold font-headline block mb-1">Adaptive Load</span>
                                The number of questions generated is intelligently calculated based on your Time limit and Difficulty level.
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="material-symbols-outlined text-tertiary text-xl flex-shrink-0">schedule</span>
                            <div>
                                <span className="text-on-surface font-bold font-headline block mb-1">Precision Pacing</span>
                                Harder difficulty assumes more complex scenarios needing more time, automatically dialing down the question count.
                            </div>
                        </li>
                    </ul>
                </GlassPanel>
            </div>
        </div>
    )
}

export default QuizConfigurator;
