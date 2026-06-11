import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../store/useAuthStore';
import { fetchActivities, fetchSavedTerms } from '../services/dashboardService';
import { Loader2 } from 'lucide-react';

const History = () => {
  const { user } = useAuthStore();

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['activities', user?.id],
    queryFn: fetchActivities,
    enabled: !!user,
  });

  const { data: savedTerms, isLoading: loadingTerms } = useQuery({
    queryKey: ['savedTerms', user?.id],
    queryFn: fetchSavedTerms,
    enabled: !!user,
  });

  const isLoading = loadingActivities || loadingTerms;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12 px-6 lg:px-8 font-inter text-gray-900 dark:text-white max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 mt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-display font-normal text-gray-900 dark:text-white mb-1">
            Study History & Activity Log
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Review your saved terminology, diagnostics, and recent learning events.
          </p>
        </motion.div>
      </header>

      {/* Bento Layout */}
      <div className="grid grid-cols-12 gap-5">
        {/* Saved Terms */}
        <section className="col-span-12 lg:col-span-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Focus Areas</h2>
          <div className="card-panel flex-1 p-5 rounded-2xl space-y-4 max-h-[500px] overflow-y-auto">
            {savedTerms?.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {savedTerms.map((termItem, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/40 group hover:shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-200 dark:border-indigo-700/50">
                        Term
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">Searched</span>
                    </div>
                    <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white">{termItem.term}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{termItem.definition}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center h-48">
                No recent searches found.
              </div>
            )}
          </div>
        </section>

        {/* Activity Log */}
        <section className="col-span-12 lg:col-span-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Activity Timeline</h2>
          <div className="card-panel flex-1 rounded-2xl p-5 relative overflow-hidden max-h-[500px] overflow-y-auto">
            {activities?.length > 0 ? (
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
              <div className="text-sm text-gray-500 flex items-center justify-center h-48 w-full">
                No recent activity logged.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default History;
