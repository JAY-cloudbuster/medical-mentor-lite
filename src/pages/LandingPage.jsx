import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Bell } from 'lucide-react';
import Dashboard from './Dashboard';

const LandingPage = () => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandOrigin, setExpandOrigin] = useState(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (isExpanding) return;
    const rect = previewRef.current.getBoundingClientRect();
    setExpandOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
    setIsExpanding(true);
    setTimeout(() => navigate('/dashboard'), 1050);
  };

  return (
    <div className="nexora-theme h-screen flex flex-col overflow-hidden relative" style={{ background: 'hsl(0 0% 100%)' }}>
      
      {/* Background Video */}
      <video autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{ opacity: 0.22 }}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" type="video/mp4" />
      </video>

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        
        {/* Hero content — fades out when expanding */}
        <motion.div
          className="w-full flex flex-col items-center shrink-0"
          animate={isExpanding ? { opacity: 0, y: -30, scale: 0.97 } : {}}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Navbar */}
          <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-inter shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-nx-foreground">✦ Medix AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-sm text-nx-muted-foreground hover:text-nx-foreground transition-colors">Dashboard</Link>
              <Link to="/terminology" className="text-sm text-nx-muted-foreground hover:text-nx-foreground transition-colors">Study Library</Link>
              <Link to="/quiz" className="text-sm text-nx-muted-foreground hover:text-nx-foreground transition-colors">Practice Exams</Link>
              <Link to="/anatomy" className="text-sm text-nx-muted-foreground hover:text-nx-foreground transition-colors">Visualizer</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 mr-2">
                <button className="text-nx-muted-foreground hover:text-nx-foreground transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-nx-border">
                  <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1KrY3hAzs_b3mzGZkIzfzajdRzqAwyBk7b4QN7QmFTzfWyf7022-UjIx-ESAbie6iLUdWeK8xqKYZ-O4rkxzX_fazXz7rDV1E-tcBOq3RWgLgroK7ttKkFLA_Dki6uESzgYqFdHmy6yCyZiwDspQlEbGiX5gUoYb3WAQqX4Ce4vgczdtoQcaRgRwtHYldy5qr6MLeKizq_v6FmJENfhI9iQozpmU5KaewI-Q_wn04vlOv--wO7-w_j5sLRS4SC1VbZGjXlwq5xYm" />
                </div>
              </div>
              <Link to="/dashboard">
                <button className="rounded-full px-5 py-2 text-sm font-medium font-inter bg-nx-primary text-nx-primary-foreground hover:opacity-90 transition-opacity">
                  Go Pro
                </button>
              </Link>
            </div>
          </nav>

          {/* Hero text */}
          <div className="flex flex-col items-center pt-6 md:pt-10 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-nx-border bg-nx-background px-4 py-1.5 text-sm text-nx-muted-foreground font-inter shadow-sm"
            >
              Powered by Gemini AI ✨
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-nx-foreground max-w-xl"
            >
              The <em className="font-display" style={{ fontStyle: 'italic' }}>Medical</em> Engine
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-center text-base md:text-lg text-nx-muted-foreground max-w-[650px] leading-relaxed font-inter"
            >
              Your AI-powered companion for mastering medical terminology, exploring 3D anatomy, and conquering adaptive clinical assessments—accelerating your path from student to specialist.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 flex items-center gap-3"
            >
              <Link to="/dashboard">
                <button className="rounded-full px-6 py-3.5 text-sm font-medium font-inter bg-nx-primary text-nx-primary-foreground hover:opacity-90 transition-opacity">
                  Learn
                </button>
              </Link>
              <button className="h-11 w-11 rounded-full border-0 bg-nx-background flex items-center justify-center hover:bg-nx-secondary transition-colors"
                      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <Play className="h-4 w-4 fill-current text-nx-foreground" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard Preview — the container whose borders expand */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isExpanding ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={isExpanding ? { duration: 0.15 } : { duration: 0.8, delay: 0.5 }}
          className="mt-6 w-full max-w-5xl px-4"
        >
          <div 
            ref={previewRef}
            onClick={handleDashboardClick}
            className="rounded-2xl overflow-hidden p-3 md:p-4 cursor-pointer group relative"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: 'var(--nx-shadow-dashboard)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-3 md:inset-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-black/10 backdrop-blur-[2px] rounded-xl">
              <div className="bg-white/95 text-gray-900 px-6 py-3 rounded-full font-semibold text-sm shadow-xl flex items-center gap-2 border border-gray-200">
                <span className="material-symbols-outlined text-base">open_in_full</span>
                Click to explore Dashboard
              </div>
            </div>

            {/* Scaled Dashboard */}
            <div className="rounded-xl overflow-hidden pointer-events-none select-none relative" style={{ height: '50vh', minHeight: '360px' }}>
              <div className="bg-white absolute top-0 left-0" style={{ 
                transform: 'scale(0.55)', 
                transformOrigin: 'top left',
                width: `${100 / 0.55}%`,
                height: `${100 / 0.55}%`,
              }}>
                <Dashboard />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          EXPANDING BOUNDARY ANIMATION
          The container starts at the preview's exact position/size
          and its borders expand outward until it fills the viewport.
          The dashboard inside scales from 0.55 → 1.0 in sync.
          ======================================================== */}
      <AnimatePresence>
        {isExpanding && expandOrigin && (
          <motion.div
            key="expand-boundary"
            className="fixed z-[100] overflow-hidden"
            initial={{
              top: expandOrigin.top,
              left: expandOrigin.left,
              width: expandOrigin.width,
              height: expandOrigin.height,
              borderRadius: 16,
            }}
            animate={{
              top: 0,
              left: 0,
              width: expandOrigin.vw,
              height: expandOrigin.vh,
              borderRadius: 0,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dashboard content scales up as the boundary expands */}
            <motion.div
              className="bg-white origin-top-left"
              style={{ 
                width: expandOrigin.vw, 
                minHeight: expandOrigin.vh,
                overflow: 'auto',
              }}
              initial={{ scale: expandOrigin.width / expandOrigin.vw }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dashboard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
