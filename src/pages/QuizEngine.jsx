import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getQuiz } from '../services/apiService';
import useAppStore from '../store/useAppStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const QuizEngine = () => {
  const { quizConfig, quizProgress, updateQuizProgress, resetQuizState, selectedAnswer, setSelectedAnswer } = useAppStore();
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizConfig.timeLimit * 60);

  const { data: quizPayload, isLoading, isError, refetch } = useQuery({
    queryKey: ['quiz', quizConfig.topic, quizConfig.difficulty, quizConfig.numQuestions],
    queryFn: () => getQuiz(quizConfig.topic, quizConfig.difficulty, quizConfig.numQuestions),
    enabled: true,
  });

  useEffect(() => { if (timeLeft <= 0 || quizProgress.isComplete || isLoading || showSummary) return; const t = setInterval(() => setTimeLeft(p => p - 1), 1000); return () => clearInterval(t); }, [timeLeft, quizProgress.isComplete, isLoading, showSummary]);
  useEffect(() => { if (timeLeft === 0 && !quizProgress.isComplete) { updateQuizProgress({ isComplete: true }); setShowSummary(true); } }, [timeLeft]);
  useEffect(() => { return () => resetQuizState(); }, []);

  const formatTime = (s) => { const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec<10?'0':''}${sec}`; };

  const totalQuestions = quizPayload?.questions?.length || 0;
  const currentQuestionIdx = quizProgress.index;
  const currentQuestion = quizPayload?.questions?.[currentQuestionIdx];
  const isAnswered = selectedAnswer !== null;

  const handleSelect = (optionId) => { if (isAnswered || !currentQuestion) return; setSelectedAnswer(optionId); if (optionId === currentQuestion.correctOption) updateQuizProgress({ score: quizProgress.score + 1 }); };
  const handleNext = () => { if (currentQuestionIdx + 1 < totalQuestions) { updateQuizProgress({ index: currentQuestionIdx + 1 }); setSelectedAnswer(null); } else { updateQuizProgress({ isComplete: true }); setShowSummary(true); } };
  const handleRestart = () => { resetQuizState(); setTimeLeft(quizConfig.timeLimit * 60); setShowSummary(false); refetch(); };

  if (isLoading) return <div className="min-h-[80vh] flex flex-col items-center justify-center"><LoadingSpinner size="lg" message="Compiling Exam..." /></div>;

  if (isError || !currentQuestion && !showSummary) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 text-rose-500">
      <span className="material-symbols-outlined text-4xl">error</span>
      <p className="font-semibold">Failed to compile exam.</p>
      <button onClick={() => refetch()} className="px-6 py-2 bg-rose-50 border border-rose-200 rounded-full font-medium text-sm">Retry</button>
    </div>
  );

  if (showSummary) {
    const accuracy = Math.round((quizProgress.score / totalQuestions) * 100);
    let remark = "Needs Improvement"; let color = "text-rose-500";
    if (accuracy >= 80) { remark = "Excellent Performance"; color = "text-emerald-600"; }
    else if (accuracy >= 60) { remark = "Good Progress"; color = "text-amber-500"; }

    return (
      <div className="flex flex-col items-center justify-center px-4 overflow-hidden relative min-h-[80vh]">
        <div className="card-panel-elevated p-10 rounded-2xl flex flex-col items-center text-center max-w-xl w-full">
          <span className="material-symbols-outlined text-5xl text-indigo-500 mb-5" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <h1 className="text-3xl font-display text-gray-900 mb-2">Exam Complete</h1>
          <p className={`text-lg font-medium mb-6 ${color}`}>{remark}</p>
          <div className="flex gap-8 mb-8">
            <div className="flex flex-col"><span className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Score</span><span className="text-4xl font-semibold text-gray-900">{accuracy}%</span></div>
            <div className="flex flex-col"><span className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Correct</span><span className="text-4xl font-semibold text-indigo-600">{quizProgress.score}/{totalQuestions}</span></div>
          </div>
          <button onClick={handleRestart} className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">Start New Exam</button>
        </div>
      </div>
    );
  }

  const progressPct = ((currentQuestionIdx) / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center px-4 overflow-hidden relative font-inter">
      <div className="w-full max-w-3xl flex flex-col gap-6 mb-28 relative z-10 pt-6">
        {/* Progress header */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
            <div>
              <span className="text-indigo-600 text-xs font-semibold tracking-wider uppercase mb-0.5 block">{quizConfig.topic} • {quizConfig.difficulty}</span>
              <h2 className="text-2xl font-semibold text-gray-900">Question {currentQuestionIdx + 1} <span className="text-gray-400 font-normal text-lg">/ {totalQuestions}</span></h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">timer</span>
              <span className={`text-xl font-semibold tabular-nums ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-gray-900'}`}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progressPct}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-1000"></motion.div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ ease: "easeInOut", duration: 0.35 }}>
            <div className="card-panel-elevated rounded-2xl p-8 md:p-10">
              <div className="flex flex-col gap-8">
                <p className="text-xl leading-relaxed text-gray-900 font-medium">{currentQuestion.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedAnswer === opt.id;
                    const isCorrect = currentQuestion.correctOption === opt.id;
                    const showResult = isAnswered;
                    
                    let btnClass = "border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-left p-5 rounded-xl flex items-center gap-5 transition-all duration-200 relative";
                    let letterClass = "w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-semibold text-lg text-gray-500 flex-shrink-0";
                    let textClass = "text-gray-700";

                    if (showResult) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-50 border border-emerald-300 p-5 rounded-xl flex items-center gap-5 relative";
                        letterClass = "w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center font-semibold text-lg text-white flex-shrink-0";
                        textClass = "text-emerald-700 font-medium";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-rose-50 border border-rose-300 p-5 rounded-xl flex items-center gap-5 relative";
                        letterClass = "w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center font-semibold text-lg text-white flex-shrink-0";
                        textClass = "text-rose-700 font-medium";
                      }
                    }

                    return (
                      <button key={opt.id} onClick={() => handleSelect(opt.id)} className={btnClass} disabled={isAnswered}>
                        {showResult && isCorrect && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span></div>}
                        {showResult && isSelected && !isCorrect && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>close</span></div>}
                        <div className={letterClass}>{opt.id}</div>
                        <span className={textClass}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl mt-2">
                    <h4 className="font-semibold text-indigo-700 mb-1.5 flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-sm">psychology</span> Explanation</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 card-panel p-4 rounded-xl flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-help group">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div><h4 className="text-gray-900 font-medium text-sm">Need a hint?</h4><p className="text-gray-400 text-xs">Unlock a mnemonic hint using 5 credits.</p></div>
          </div>
          <div className="card-panel p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-500 text-sm font-medium">Flag for Review</span>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-amber-500 transition-colors">flag</span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 w-full lg:w-[calc(100%-15rem)] right-0 p-6 flex justify-center items-center z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 w-full max-w-3xl mx-auto">
          <button className="card-panel h-14 w-14 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all active:scale-90">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button onClick={handleNext} disabled={!isAnswered} className={`flex-grow h-14 rounded-full font-medium text-base flex items-center justify-center gap-3 transition-all ${isAnswered ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
            {currentQuestionIdx + 1 === totalQuestions ? 'Finish Exam' : 'Next Question'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
