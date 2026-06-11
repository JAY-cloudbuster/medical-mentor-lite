import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { defineTerm, getRelatedTerms, getYoutubeVideos } from '../services/apiService';
import useAppStore from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { capitalizeWords, truncateText } from '../utils/textUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TerminologyExplorer = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, correctedTerm, setCorrectedTerm, definitionData, setDefinitionData, relatedTerms, setRelatedTerms, youtubeVideos, setYoutubeVideos } = useAppStore();

  const [activeSearch, setActiveSearch] = useState(searchTerm || 'Atrial Fibrillation');

  const { data: defData, isLoading: isLoadingDef, isError: isErrorDef } = useQuery({ queryKey: ['definition', activeSearch], queryFn: () => defineTerm(activeSearch), enabled: !!activeSearch });
  const { data: relTerms, isLoading: isLoadingRel } = useQuery({ queryKey: ['related', activeSearch], queryFn: () => getRelatedTerms(activeSearch), enabled: !!activeSearch });
  const { data: videos, isLoading: isLoadingVid } = useQuery({ queryKey: ['youtube', activeSearch], queryFn: () => getYoutubeVideos(activeSearch), enabled: !!activeSearch });

  useEffect(() => { 
    if (defData) { 
      if (defData.correctedTerm && defData.correctedTerm.toLowerCase() !== activeSearch.toLowerCase()) { 
        setCorrectedTerm(defData.correctedTerm); 
      } else { 
        setCorrectedTerm(null); 
      } 
      setDefinitionData(defData); 
    } 
  }, [defData, activeSearch, setCorrectedTerm, setDefinitionData]);

  useEffect(() => { if (relTerms) setRelatedTerms(relTerms.terms || []); }, [relTerms, setRelatedTerms]);
  useEffect(() => { if (videos) setYoutubeVideos(videos); }, [videos, setYoutubeVideos]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveSearch(searchTerm.trim());
    }
  };

  const handleRelatedClick = (term) => { 
    setSearchTerm(term); 
    setActiveSearch(term);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-inter text-gray-900 dark:text-white">
      {/* Search Bar */}
      <div className="sticky top-16 z-30 px-6 lg:px-8 pt-2 pb-4 -mt-12
                      bg-white/80 dark:bg-gray-950/80
                      backdrop-blur-md border-b border-gray-100 dark:border-gray-700/60
                      transition-colors duration-300">
        <form onSubmit={handleSearchSubmit} className="max-w-4xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="w-full bg-gray-50 dark:bg-gray-800/80
                       border border-gray-200 dark:border-gray-700/60
                       rounded-xl py-3.5 pl-12 pr-28
                       text-gray-900 dark:text-white
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30
                       transition-all text-base"
            placeholder="Explore medical terminology, pathways, or concepts..."
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-2">
            {isLoadingDef && (
              <span className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
            )}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
        <AnimatePresence>
          {correctedTerm && !isLoadingDef && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 ml-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Did you mean <button onClick={() => { setSearchTerm(correctedTerm); setActiveSearch(correctedTerm); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline italic">{correctedTerm}</button>?</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 lg:px-8 pb-12 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto mt-32">
        {/* Left Panel */}
        <div className="lg:w-3/5 space-y-6">
          <div className="card-panel-elevated p-8 lg:p-10 rounded-2xl relative overflow-hidden min-h-[500px]">
             {isLoadingDef ? (
                <div className="animate-pulse space-y-6">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                    <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded w-3/4 mb-10"></div>
                    <div><div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-1/3 mb-3"></div><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2"></div><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2"></div><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div></div>
                </div>
             ) : isErrorDef ? (
                <div className="text-rose-500 flex flex-col items-center justify-center h-full pt-10">
                    <span className="material-symbols-outlined text-5xl mb-4">error</span>
                    <h3 className="font-semibold text-xl">Connection Lost</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Could not retrieve the definition for this term.</p>
                </div>
             ) : definitionData ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs tracking-[0.2em] uppercase font-semibold mb-3 block">Core Pathology Term</span>
                  <h1 className="text-4xl lg:text-5xl font-display text-gray-900 dark:text-white mb-8">{capitalizeWords(activeSearch)}</h1>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-indigo-500 text-lg">description</span> Definition
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{definitionData.definition}</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-sm font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base">analytics</span> Pathophysiology
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{definitionData.pathophysiology}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-base">clinical_notes</span> Clinical Relevance
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{definitionData.clinicalRelevance}</p>
                      </div>
                    </section>

                    <div className="pt-5 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                      <button className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">
                        <span className="material-symbols-outlined text-base">bookmark</span> Save to Library
                      </button>
                      <button
                        onClick={() => navigate(`/graph/${encodeURIComponent(activeSearch)}`)}
                        className="bg-gray-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-indigo-500 transition-colors">
                        <span className="material-symbols-outlined text-sm">hub</span> View Knowledge Graph
                      </button>
                    </div>
                  </div>
                </motion.div>
             ) : null}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-2/5 space-y-6">
          <div className="card-panel p-5 rounded-2xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Live Knowledge Casts</h3>
            {isLoadingVid ? (
                <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
            ) : youtubeVideos && youtubeVideos.length > 0 ? (
               <div className="space-y-3">
                 {youtubeVideos.map(vid => (
                     <a
                       key={vid.id}
                       href={vid.url || `https://www.youtube.com/watch?v=${vid.id}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex gap-3 group cursor-pointer"
                     >
                          <div className="w-28 aspect-video rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative flex-shrink-0">
                             <img src={vid.thumbnail} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" alt="thumbnail" />
                             <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 text-[10px] rounded text-white font-medium">{vid.duration}</div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                 <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                               </div>
                             </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                             <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">{vid.title}</p>
                             <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium flex items-center gap-1">
                               <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.5a8.19 8.19 0 0 0 4.79 1.52V6.57a4.85 4.85 0 0 1-1.02.12z"/></svg>
                               Watch on YouTube →
                             </p>
                          </div>
                     </a>
                 ))}
               </div>
            ) : (
                 <div className="text-center p-4 text-gray-400 dark:text-gray-500 text-sm">No visual assets available.</div>
            )}
          </div>

          <div className="card-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              Related Concepts
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Expand Map</span>
            </h3>
            {isLoadingRel ? (
                 <div className="flex flex-wrap gap-2">{[1,2,3,4,5].map(i => <div key={i} className="h-9 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>)}</div>
            ) : (
                 <div className="flex flex-wrap gap-2">
                   {relatedTerms.map((term, i) => (
                       <button onClick={() => handleRelatedClick(term)} key={i} className="px-4 py-2.5 rounded-lg
                                 bg-gray-50 dark:bg-gray-800/60
                                 border border-gray-200 dark:border-gray-700/50
                                 hover:border-indigo-300 dark:hover:border-indigo-600
                                 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                                 text-sm font-medium transition-all duration-300
                                 flex items-center gap-2 group
                                 text-gray-600 dark:text-gray-400
                                 hover:text-indigo-600 dark:hover:text-indigo-400">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-50 group-hover:opacity-100"></span>
                         {term}
                       </button>
                   ))}
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminologyExplorer;
