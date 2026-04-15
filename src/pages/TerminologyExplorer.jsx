import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import GlassPanel from '../components/ui/GlassPanel';
import { defineTerm, getRelatedTerms, getYoutubeVideos } from '../services/apiService';
import useAppStore from '../store/useAppStore';

const TerminologyExplorer = () => {
  const { 
    searchTerm, setSearchTerm, 
    correctedTerm, setCorrectedTerm, 
    definitionData, setDefinitionData,
    relatedTerms, setRelatedTerms,
    youtubeVideos, setYoutubeVideos
  } = useAppStore();

  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm || 'Atrial Fibrillation');
  
  // Custom debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== '') setDebouncedTerm(searchTerm);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: defData, isLoading: isLoadingDef, isError: isErrorDef } = useQuery({
    queryKey: ['definition', debouncedTerm],
    queryFn: () => defineTerm(debouncedTerm),
    enabled: !!debouncedTerm,
  });

  const { data: relTerms, isLoading: isLoadingRel } = useQuery({
    queryKey: ['related', debouncedTerm],
    queryFn: () => getRelatedTerms(debouncedTerm),
    enabled: !!debouncedTerm,
  });

  const { data: videos, isLoading: isLoadingVid } = useQuery({
    queryKey: ['youtube', debouncedTerm],
    queryFn: () => getYoutubeVideos(debouncedTerm),
    enabled: !!debouncedTerm,
  });

  useEffect(() => {
    if (defData) {
      // Setup spelling correction handling based on API mock response
      if (defData.correctedTerm && defData.correctedTerm.toLowerCase() !== debouncedTerm.toLowerCase()) {
        setCorrectedTerm(defData.correctedTerm);
      } else {
        setCorrectedTerm(null);
      }
      setDefinitionData(defData);
    }
  }, [defData]);

  useEffect(() => {
    if (relTerms) setRelatedTerms(relTerms.terms || []);
  }, [relTerms]);

  useEffect(() => {
    if (videos) setYoutubeVideos(videos);
  }, [videos]);

  const handleRelatedClick = (term) => {
    setSearchTerm(term);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-body text-on-surface">
      {/* Sticky Search Bar Area */}
      <div className="sticky top-0 z-30 px-8 py-6 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            className="w-full bg-surface-container border border-outline-variant rounded-2xl py-4 pl-12 pr-6 text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-lg" 
            placeholder="Explore medical terminology, pathways, or neural patterns..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoadingDef && (
            <div className="absolute inset-y-0 right-4 flex items-center">
               <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span>
            </div>
          )}
        </div>
        <AnimatePresence>
          {correctedTerm && !isLoadingDef && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 ml-4">
              <span className="text-sm text-on-surface-variant">
                Did you mean <button onClick={() => setSearchTerm(correctedTerm)} className="text-secondary font-bold hover:underline italic">{correctedTerm}</button>?
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Panel (60%) */}
        <div className="lg:w-3/5 space-y-8">
          <GlassPanel className="p-10 rounded-[2rem] relative overflow-hidden min-h-[600px]">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>

             {isLoadingDef ? (
                <div className="animate-pulse space-y-8">
                    <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
                    <div className="h-16 bg-white/10 rounded w-3/4 mb-12"></div>
                    <div>
                        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    </div>
                </div>
             ) : isErrorDef ? (
                <div className="text-error flex flex-col items-center justify-center h-full pt-10">
                    <span className="material-symbols-outlined text-5xl mb-4">error</span>
                    <h3 className="font-headline font-bold text-xl">Connection to Neural DB Lost</h3>
                    <p className="text-sm opacity-80 mt-2">Could not retrieve the definition for this term.</p>
                </div>
             ) : definitionData ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <span className="text-primary font-headline text-sm tracking-[0.2em] uppercase font-bold mb-4 block">Core Pathology Term</span>
                  <h1 className="text-6xl font-headline font-bold text-on-surface glowing-underline mb-12 tracking-tight capitalize">{debouncedTerm}</h1>
                  
                  <div className="space-y-10">
                    <section>
                      <h3 className="font-headline text-xl text-primary flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary">description</span>
                        Definition
                      </h3>
                      <p className="text-lg leading-relaxed text-on-surface-variant font-light">
                        {definitionData.definition}
                      </p>
                    </section>
                    
                    <section className="grid grid-cols-2 gap-8">
                      <div className="bg-surface-container-high/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-headline text-md text-secondary flex items-center gap-3 mb-3">
                          <span className="material-symbols-outlined">analytics</span>
                          Pathophysiology
                        </h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {definitionData.pathophysiology}
                        </p>
                      </div>
                      <div className="bg-surface-container-high/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-headline text-md text-tertiary flex items-center gap-3 mb-3">
                          <span className="material-symbols-outlined">clinical_notes</span>
                          Clinical Relevance
                        </h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {definitionData.clinicalRelevance}
                        </p>
                      </div>
                    </section>
                    
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">bookmark</span> Save to Library
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
             ) : null}
          </GlassPanel>
        </div>

        {/* Right Panel (40%) */}
        <div className="lg:w-2/5 space-y-8">
          
          <GlassPanel className="p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_rgba(138,43,226,0.1)] relative">
            <h3 className="font-headline text-lg text-on-surface mb-4">Live Knowledge Casts</h3>
            {isLoadingVid ? (
                <div className="aspect-video w-full rounded-2xl bg-white/5 animate-pulse"></div>
            ) : youtubeVideos && youtubeVideos.length > 0 ? (
               <div className="space-y-4">
                  {youtubeVideos.map(vid => (
                      <div key={vid.id} className="flex gap-4 group cursor-pointer">
                           <div className="w-32 aspect-video rounded-xl bg-surface-container overflow-hidden relative">
                              <img src={vid.thumbnail} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" alt="thumbnail" />
                              <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-[10px] rounded text-white font-bold">{vid.duration}</div>
                           </div>
                           <div className="flex-1 flex flex-col justify-center">
                              <p className="text-sm font-bold text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">{vid.title}</p>
                              <p className="text-xs text-outline mt-1 font-bold">Watch Video</p>
                           </div>
                      </div>
                  ))}
               </div>
            ) : (
                <div className="text-center p-4 text-surface-variant">No visual assets available.</div>
            )}
          </GlassPanel>

          <GlassPanel className="p-8 rounded-[2rem]">
            <h3 className="font-headline text-lg text-on-surface mb-6 flex items-center justify-between">
              Related Neural Nodes
              <span className="text-xs text-tertiary font-bold tracking-widest uppercase">Expand Map</span>
            </h3>
            
            {isLoadingRel ? (
                 <div className="flex flex-wrap gap-3">
                     {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 bg-white/5 rounded-xl animate-pulse"></div>)}
                 </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                  {relatedTerms.map((term, i) => {
                    const colors = ['primary', 'secondary', 'tertiary'];
                    const hexes = ['#43f3f6', '#ff50fc', '#bf81ff'];
                    const colorIndex = i % 3;
                    const c = colors[colorIndex];
                    const h = hexes[colorIndex];

                    return (
                        <button onClick={() => handleRelatedClick(term)} key={i} className={`px-5 py-3 rounded-xl bg-surface-container-high hover:bg-${c}/10 border border-outline-variant hover:border-${c} text-sm font-medium transition-all duration-300 flex items-center gap-2 group`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-${c} group-hover:shadow-[0_0_8px_${h}]`}></span>
                          {term}
                        </button>
                    )
                  })}
                </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default TerminologyExplorer;
