import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/ui/GlassPanel';

const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      {/* Top Navigation Bar for Landing (slightly different from MainLayout as it's transparent) */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent font-headline tracking-tight">MEDIX AI</span>
          <div className="hidden md:flex gap-6">
            <Link className="text-cyan-400 border-b-2 border-cyan-400 pb-1 font-headline tracking-tight transition-all" to="/dashboard">Dashboard</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-headline tracking-tight" to="/terminology">Study Library</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-headline tracking-tight" to="/quiz">Practice Exams</Link>
            <Link className="text-slate-400 hover:text-white transition-colors font-headline tracking-tight" to="/anatomy">Visualizer</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 mr-4 hidden md:flex">
            <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold rounded-xl active:scale-95 transition-transform shadow-[0_0_20px_rgba(67,243,246,0.3)] hover:shadow-[0_0_30px_rgba(67,243,246,0.5)]">
            Go Pro
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors cursor-pointer">
            <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1KrY3hAzs_b3mzGZkIzfzajdRzqAwyBk7b4QN7QmFTzfWyf7022-UjIx-ESAbie6iLUdWeK8xqKYZ-O4rkxzX_fazXz7rDV1E-tcBOq3RWgLgroK7ttKkFLA_Dki6uESzgYqFdHmy6yCyZiwDspQlEbGiX5gUoYb3WAQqX4Ce4vgczdtoQcaRgRwtHYldy5qr6MLeKizq_v6FmJENfhI9iQozpmU5KaewI-Q_wn04vlOv--wO7-w_j5sLRS4SC1VbZGjXlwq5xYm"/>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen neural-bg flex flex-col items-center justify-center pt-20 px-6">
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto text-center z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 text-primary text-sm font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SYSTEM STATUS: OPTIMAL NEURAL LINK
          </div>
          <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter text-on-surface mb-6 leading-tight">
            Understand Medicine. <br/>
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">Don't Memorize It.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto mb-12 font-body leading-relaxed">
            AI-powered explanations, quizzes, and 3D anatomy in one place. 
            Experience the future of medical education.
          </p>

          {/* Immersive Search Interface */}
          <div className="relative w-full max-w-3xl mx-auto mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl rounded-full opacity-50"></div>
            <div className="relative flex items-center glass-panel glow-border-primary p-2 rounded-2xl">
              <span className="material-symbols-outlined ml-4 text-primary text-3xl">psychology</span>
              <input className="w-full bg-transparent border-none focus:ring-0 text-xl py-4 px-4 text-on-surface placeholder:text-outline/60 font-body" placeholder="Ask anything about clinical medicine..." type="text"/>
              <button className="bg-primary text-on-primary-container px-8 py-3 rounded-xl font-bold font-headline flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all w-max">
                ANALYZE <span className="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          </div>

          {/* Suggestion Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {['Pharmacology Basics', 'Diagnostic Reasoning', 'Anatomy Map', 'Case Studies'].map((pill, i) => (
              <button key={i} className="px-4 py-2 rounded-full glass-panel border border-outline-variant/30 text-sm text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  {i === 0 ? 'pill' : i === 1 ? 'biotech' : i === 2 ? 'body_system' : 'history'}
                </span> {pill}
              </button>
            ))}
          </div>

          {/* CTA Cluster */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/dashboard" className="w-full md:w-auto px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold rounded-2xl text-lg font-headline hover:scale-105 hover:shadow-[0_0_40px_rgba(67,243,246,0.4)] transition-all flex items-center justify-center gap-3">
              Start Exploring <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/quiz" className="w-full md:w-auto px-10 py-5 glass-panel border border-secondary/40 text-on-surface font-bold rounded-2xl text-lg font-headline hover:bg-secondary/10 transition-all flex items-center justify-center gap-3">
              Try Quiz <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            </Link>
          </div>
        </motion.div>

        {/* Floating Decorative Modules (Asymmetric Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-7xl mx-auto mt-24 mb-20 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="md:col-span-4 glass-panel glow-border-primary p-8 rounded-3xl group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">view_in_ar</span>
            </div>
            <h3 className="text-2xl font-bold font-headline mb-3">Spatial Learning</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">Interact with hyper-realistic 3D anatomical models that respond to your queries in real-time.</p>
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
              <img alt="3D Anatomy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM6YAm88_MS6XFaNPFNVL8s7A4-dyFmJ37o-WajUIhTeK8hDxVOjzwsQ0uk3B7K2VtwjS8XOBasp6uaWEFMCYZDRCtfkDn0NL_Djlj2NF3A426IkOdOYsc85DoMqOjr2tRjctIy5kCnmgEs5Gsfpqt7mVjbbfcIcNqDDP5JedGG2EzRtOLKZW2saVxkvsN4I17wtExtt2GHwbvl4LKAr4XCj9mS2n8W89OXOkaFsmZmA_zNKbZBGZ451ToLLW2401F0-EfeMjrUs4E"/>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 glass-panel border border-tertiary/20 p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-tertiary/20 text-9xl">analytics</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-headline mb-3">Neural Feedback</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">Our AI analyzes your knowledge gaps to curate a custom curriculum tailored to your brain's pace.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Knowledge Retention</span>
                  <span className="text-tertiary">92%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} className="h-full bg-gradient-to-r from-tertiary to-secondary"></motion.div>
                </div>
                <div className="flex items-center justify-between text-sm font-medium pt-2">
                  <span>Diagnostic Speed</span>
                  <span className="text-primary">+15%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '78%' }} className="h-full bg-gradient-to-r from-primary to-cyan-500"></motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-3 glass-panel border border-secondary/20 p-8 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <span className="material-symbols-outlined text-secondary text-5xl mb-6 glow-text-secondary">workspace_premium</span>
              <h3 className="text-2xl font-bold font-headline mb-3">Expert Verified</h3>
              <p className="text-on-surface-variant leading-relaxed">Content cross-referenced with latest peer-reviewed journals and medical textbooks.</p>
            </div>
            <div className="mt-8 flex -space-x-3">
              <img alt="Doctor 1" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbj6kUJCm3ccAR1TcNiCqQ_aTN0G98SJcbccNFWJPiMjyjOfojawmqZ0rrCZ2h1hvpNfcYP_j8dkDregDqLCRUlbuBsks0_eFD9_2qNCkVZyuh5qr0hWe420sODjBomWdrDz16Z2pzbLphyYQolw-WWde-VRKhWDoWXOvXrB68_GqVhAaPduKDRb86ksSQhbNF-7fI6RsnJkU1st6tB4kuAwfz6KYw6T9CJP6Qkvbmw02oC_EOswXhx8m5foPfOmzLWLUcCnSuHlV"/>
              <img alt="Doctor 2" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2ltgFNfUXfom5Sn0EL8rwY37IEvAbllreezmneMzsEa72vYZn8vkHE7nkqh6VqTVwp_w8s1lW_JhEUjnZAKDOuN08Ti4XKV-qSNywXCShxy2ocqvAmZCDzUOaBR4O00TS_0I67TzsKI7pC3kVvhFgptqfKjvIeUSY4sPcpI6FBC3GakRHKYu3HWIxeVnD0590v71AhafIZk67p7I5oipzjL427j6GpxTAtVJwfUziJHY9ZU2cyFp5O0h7HklIZ3M7rnJ-034ClQhR"/>
              <img alt="Doctor 3" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv8qvTDdW3Xl5SVEOO0HhAk8192Uac-k9niLK63mpvCfDtkXaVaT7ejAwyHx0mY6ZvRKnHuQ7Cw8MLcR6Knh_Wyn2VIFyAs1n7TnORUf3HRXRwVYrQFH0cO72UBUPu_T1d1Y8Qpqwn7Uwujr4E3VZHfFW-EJM9VBOKd_f-ODZsaG7igPAqXe9MDoS73mh2AqgZ2s5gp_O8E2ism59a55RbQP33Oj4EIGS7tx2bLCkiSubzlSRLEXKKaHLMDuwL_COHIKqjr3i70Zy5"/>
              <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center text-[10px] font-bold">+200</div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low py-12 px-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold font-headline text-primary tracking-tight">MEDIX AI</span>
            <p className="text-sm text-outline">Revolutionizing Medical Education through Intelligence.</p>
          </div>
          <div className="flex gap-12 text-sm text-on-surface-variant">
            <div className="flex flex-col gap-3">
              <span className="text-on-surface font-bold">Platform</span>
              <Link className="hover:text-primary transition-colors" to="/dashboard">Neural Map</Link>
              <Link className="hover:text-primary transition-colors" to="/terminology">Study Library</Link>
              <Link className="hover:text-primary transition-colors" to="/anatomy">3D Anatomy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-on-surface font-bold">Company</span>
              <a className="hover:text-primary transition-colors" href="#">About</a>
              <a className="hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="hover:text-primary transition-colors" href="#">Contact</a>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-sm">share</span>
            </button>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-sm">public</span>
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-outline/50 uppercase tracking-widest">
            © 2024 MEDIX AI SYSTEMS. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
