import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import GlassPanel from '../components/ui/GlassPanel';
import { getQuiz } from '../services/apiService';
import useAppStore from '../store/useAppStore';

const QuizEngine = () => {
  const { quizConfig, quizProgress, updateQuizProgress, resetQuizState, selectedAnswer, setSelectedAnswer } = useAppStore();
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizConfig.timeLimit * 60);

  const { data: quizPayload, isLoading, isError, refetch } = useQuery({
    queryKey: ['quiz', quizConfig.topic, quizConfig.difficulty, quizConfig.numQuestions],
    queryFn: () => getQuiz(quizConfig.topic, quizConfig.difficulty, quizConfig.numQuestions),
    enabled: true,
  });

  useEffect(() => {
     if (timeLeft <= 0 || quizProgress.isComplete || isLoading || showSummary) return;
     const timerId = setInterval(() => {
         setTimeLeft(prev => prev - 1);
     }, 1000);
     return () => clearInterval(timerId);
  }, [timeLeft, quizProgress.isComplete, isLoading, showSummary]);

  useEffect(() => {
      if (timeLeft === 0 && !quizProgress.isComplete) {
          updateQuizProgress({ isComplete: true });
          setShowSummary(true);
      }
  }, [timeLeft]);

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Effect to reset on mount if unmounted previously
  useEffect(() => {
    return () => resetQuizState();
  }, []);

  const totalQuestions = quizPayload?.questions?.length || 0;
  const currentQuestionIdx = quizProgress.index;
  const currentQuestion = quizPayload?.questions?.[currentQuestionIdx];
  const isAnswered = selectedAnswer !== null;

  const handleSelect = (optionId) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(optionId);
    
    // Update score immediately if correct
    if (optionId === currentQuestion.correctOption) {
        updateQuizProgress({ score: quizProgress.score + 1 });
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx + 1 < totalQuestions) {
        updateQuizProgress({ index: currentQuestionIdx + 1 });
        setSelectedAnswer(null);
    } else {
        updateQuizProgress({ isComplete: true });
        setShowSummary(true);
    }
  };

  const handleRestart = () => {
      resetQuizState();
      setTimeLeft(quizConfig.timeLimit * 60);
      setShowSummary(false);
      refetch();
  };

  if (isLoading) {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
              <span className="animate-spin text-primary material-symbols-outlined text-4xl">autorenew</span>
              <p className="text-primary font-headline tracking-widest uppercase text-sm font-bold animate-pulse">Compiling Neural Nodes...</p>
          </div>
      );
  }

  if (isError || !currentQuestion && !showSummary) {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 text-error">
              <span className="material-symbols-outlined text-4xl">error</span>
              <p className="font-headline font-bold">Failed to compile exam parameters.</p>
              <button onClick={() => refetch()} className="px-6 py-2 bg-error/20 rounded-full font-bold">Retry</button>
          </div>
      )
  }

  if (showSummary) {
      const accuracy = Math.round((quizProgress.score / totalQuestions) * 100);
      let remark = "Neural Integration Sub-optimal";
      let color = "text-error";
      if (accuracy >= 80) { remark = "Elite Neural Pathways Verified"; color = "text-primary"; }
      else if (accuracy >= 60) { remark = "Competency Baseline Reached"; color = "text-secondary"; }

      return (
          <div className="flex flex-col items-center justify-center px-4 overflow-hidden relative min-h-[80vh]">
              <GlassPanel className="p-12 rounded-[2rem] flex flex-col items-center text-center max-w-2xl w-full border border-primary/20">
                  <span className="material-symbols-outlined text-6xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <h1 className="text-4xl font-headline font-bold mb-2">Simulation Complete</h1>
                  <p className={`text-xl font-body font-bold mb-8 ${color}`}>{remark}</p>
                  
                  <div className="flex gap-8 mb-12">
                      <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-outline tracking-widest">Final Score</span>
                          <span className="text-5xl font-headline font-bold">{accuracy}%</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-outline tracking-widest">Correct Answers</span>
                          <span className="text-5xl font-headline font-bold text-secondary">{quizProgress.score}/{totalQuestions}</span>
                      </div>
                  </div>

                  <button onClick={handleRestart} className="bg-primary text-on-primary-container px-10 py-4 rounded-xl font-bold tracking-wide hover:brightness-110 active:scale-95 transition-all">
                      INITIALIZE NEW EXAM
                  </button>
              </GlassPanel>
          </div>
      )
  }

  const progressPercentage = ((currentQuestionIdx) / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <div className="w-full max-w-4xl flex flex-col gap-8 mb-32 relative z-10 pt-8">
        
        {/* Question Meta & Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-2">
            <div className="flex flex-col">
              <span className="text-tertiary text-xs font-bold tracking-widest uppercase mb-1">{quizConfig.topic} &bull; {quizConfig.difficulty}</span>
              <h2 className="font-headline text-3xl font-bold text-on-surface">Question {currentQuestionIdx + 1} <span className="text-on-surface-variant font-light text-xl">/ {totalQuestions}</span></h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">timer</span>
              <span className={`font-headline text-2xl font-bold tabular-nums ${timeLeft < 60 ? 'text-error animate-pulse' : 'text-on-surface'}`}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden relative">
            <motion.div 
               animate={{ width: `${progressPercentage}%` }}
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 shadow-[0_0_10px_rgba(67,243,246,0.5)]">
            </motion.div>
          </div>
        </div>

        {/* Central Quiz Card */}
        <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
            >
              <GlassPanel className="neural-glow rounded-[2rem] p-10 md:p-14 relative group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-2xl rounded-tl-[2rem] -z-10 opacity-50"></div>
                <div className="flex flex-col gap-10">
                  <div className="space-y-6">
                    <p className="font-headline text-2xl leading-relaxed text-on-surface font-medium">
                      {currentQuestion.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selectedAnswer === opt.id;
                      const isCorrect = currentQuestion.correctOption === opt.id;
                      const showResult = isAnswered;
                      
                      let btnClass = "glass-panel hover:shadow-[inset_0_0_1px_1px_rgba(67,243,246,0.2),0_0_20px_rgba(67,243,246,0.1)] hover:scale-105 text-left p-6 rounded-2xl flex items-center gap-6 group/option transition-all duration-300";
                      let letterClass = "w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-headline font-bold text-xl text-primary border border-white/5 group-hover/option:bg-primary group-hover/option:text-on-primary transition-colors flex-shrink-0";
                      let textClass = "font-body text-lg text-on-surface/90 group-hover/option:text-white";

                      if (showResult) {
                        if (isCorrect) {
                           btnClass = "bg-primary/10 border border-primary/40 p-6 rounded-2xl flex items-center gap-6 transition-all duration-300 shadow-[0_0_20px_rgba(67,243,246,0.15)] relative";
                           letterClass = "w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-headline font-bold text-xl text-on-primary flex-shrink-0";
                           textClass = "font-body text-lg text-primary font-bold";
                        } else if (isSelected && !isCorrect) {
                           btnClass = "bg-error/10 border border-error/40 p-6 rounded-2xl flex items-center gap-6 transition-all duration-300 relative";
                           letterClass = "w-12 h-12 rounded-xl bg-error flex items-center justify-center font-headline font-bold text-xl text-on-error flex-shrink-0";
                           textClass = "font-body text-lg text-error font-bold";
                        }
                      }

                      return (
                        <button 
                          key={opt.id} 
                          onClick={() => handleSelect(opt.id)}
                          className={btnClass}
                          disabled={isAnswered}
                        >
                          {showResult && isCorrect && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                              <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                            </div>
                          )}
                           {showResult && isSelected && !isCorrect && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center shadow-lg">
                              <span className="material-symbols-outlined text-on-error text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                            </div>
                          )}
                          <div className={letterClass}>{opt.id}</div>
                          <span className={textClass}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {isAnswered && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-surface-container-high/50 border border-secondary/20 p-6 rounded-2xl mt-4">
                          <h4 className="font-headline font-bold text-secondary mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">psychology</span> Neural Explanation
                          </h4>
                          <p className="text-on-surface-variant text-sm leading-relaxed">{currentQuestion.explanation}</p>
                      </motion.div>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
        </AnimatePresence>

        {/* Hint/Review Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-help group">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <h4 className="text-on-surface font-bold text-sm">Need a Neural Link?</h4>
              <p className="text-on-surface-variant text-xs">Unlock a mnemonic hint using 5 credits.</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-on-surface-variant text-sm font-medium">Flag for Review</span>
            <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">flag</span>
          </div>
        </div>
      </div>

      {/* Fixed Positioning Bottom Footer for Quiz */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-16rem)] right-0 p-8 flex justify-center items-center z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-6 w-full max-w-4xl mx-auto">
          <button className="glass-panel h-16 w-16 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/10 transition-all active:scale-90">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button onClick={handleNext} disabled={!isAnswered} className={`flex-grow h-16 rounded-2xl p-[1px] group overflow-hidden ${isAnswered ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10 opacity-50'}`}>
            <div className="w-full h-full bg-surface-container-lowest/80 rounded-[calc(1rem-1px)] flex items-center justify-center gap-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <span className="font-headline text-xl font-bold text-white relative z-10">{currentQuestionIdx + 1 === totalQuestions ? 'Finish Simulation' : 'Next Question'}</span>
              <span className="material-symbols-outlined text-white relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
