import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/useAuthStore';
import { fetchProfile, fetchActivities, fetchSavedTerms } from '../services/dashboardService';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    refetchInterval: 5000
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    refetchInterval: 5000
  });

  const { data: savedTerms, isLoading: loadingTerms } = useQuery({
    queryKey: ['savedTerms'],
    queryFn: fetchSavedTerms,
    refetchInterval: 5000
  });

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12 px-6 lg:px-8 font-inter text-gray-900 dark:text-white max-w-7xl mx-auto">
      {/* Welcome */}
      <header className="mb-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-display font-normal text-gray-900 dark:text-white mb-1">
              Welcome back, {profile?.displayName || user?.email?.split('@')[0]}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Your neural synthesis for <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Medicine</span> is {profile?.xp || 0} XP strong.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
               className="card-panel px-5 py-3 rounded-xl flex items-center gap-3 border-l-4 border-indigo-500">
            <div className="text-right">
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Study Streak</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{profile?.streak || 0} Days</div>
            </div>
            <span className="material-symbols-outlined text-indigo-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-5">

        {/* Saved Terms */}
        <section className="col-span-12">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Focus Areas</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {loadingTerms ? (
               <div className="text-sm text-gray-500">Loading your terms...</div>
            ) : savedTerms?.length > 0 ? (
              savedTerms.map((termItem, i) => (
                <div key={i} className="min-w-[260px] card-panel p-5 rounded-xl group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between mb-3">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200 dark:border-indigo-700/50">
                      Term
                    </span>
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors text-lg">north_east</span>
                  </div>
                  <h3 className="text-base font-semibold mb-0.5 text-gray-900 dark:text-white">{termItem.term}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{termItem.definition}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl w-full">
                No recent terms found. Use the Terminology Explorer to search for medical terms!
              </div>
            )}
          </div>
        </section>

        {/* Exam Mastery Placeholder */}
        <section className="col-span-12 lg:col-span-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Exam Mastery</h2>
          <div className="card-panel-elevated flex-1 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-100 dark:text-gray-700" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" strokeWidth="10"></circle>
                <motion.circle
                   initial={{ strokeDashoffset: 528 }} animate={{ strokeDashoffset: Math.max(0, 528 - (profile?.xp || 0) * 0.5) }} transition={{ duration: 1.5, ease: "easeOut" }}
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
                <span className="text-4xl font-semibold text-gray-900 dark:text-white">{profile?.xp || 0}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase">Total XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="col-span-12 lg:col-span-8 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Activity Log</h2>
          <div className="card-panel flex-1 rounded-2xl p-5 relative overflow-hidden h-[300px] overflow-y-auto">
            {loadingActivities ? (
               <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : activities?.length > 0 ? (
              <div className="relative space-y-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-indigo-300 via-violet-300 to-transparent dark:from-indigo-600 dark:via-violet-600"></div>

                {activities.map((entry, i) => (
                  <div key={i} className="relative pl-7">
                    <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600/50 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-[12px] text-indigo-500 dark:text-indigo-400">check_circle</span>
                    </div>
                    <div className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.actionType.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{entry.details?.term || entry.details?.topic || 'General Activity'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-center justify-center h-full w-full">
                No recent activity logged.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
