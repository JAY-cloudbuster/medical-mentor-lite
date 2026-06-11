import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import KnowledgeGraph3D from '../components/KnowledgeGraph3D';
import { fetchGraph, fetchNodeInfo } from '../services/graphService';
import useAppStore from '../store/useAppStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { capitalizeWords } from '../utils/textUtils';

const KnowledgeGraphPage = () => {
  const { term } = useParams();
  const navigate = useNavigate();
  const { setGraphData, selectedNode, setSelectedNode } = useAppStore();

  const { data, isLoading, isError, isFetching } = useQuery({ queryKey: ['graph', term], queryFn: () => fetchGraph(term), enabled: !!term });
  const { data: explanationData, isLoading: isLoadingExplanation } = useQuery({ queryKey: ['nodeExplain', selectedNode?.label], queryFn: () => fetchNodeInfo(selectedNode?.label), enabled: !!selectedNode });

  useEffect(() => {
    if (data) {
      setGraphData(data);
      const idx = data.nodes.findIndex(n => n.label.toLowerCase() === term.toLowerCase());
      if (idx !== -1) setSelectedNode(data.nodes[idx]);
      else if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
    }
    return () => { setGraphData(null); setSelectedNode(null); };
  }, [data, term, setGraphData, setSelectedNode]);

  return (
    // Use dvh (dynamic viewport height) to avoid mobile bar overlap; fallback to 100vh
    <div className="w-full relative flex overflow-hidden font-inter" style={{ height: '100dvh' }}>

      {/* 3D Canvas — full background */}
      <div className="absolute inset-0 cursor-crosshair z-0 dark-canvas-bg">
        {isLoading || isFetching ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 w-full h-full bg-gray-900/80 backdrop-blur-sm">
            <LoadingSpinner size="md" message="Synthesizing Graph..." />
            <p className="text-sm text-gray-400 mt-2">Connecting topologies for '{capitalizeWords(term)}'</p>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-400">
            <span className="material-symbols-outlined text-5xl mb-4">error</span>
            <h2>Graph processing failed. Try another term.</h2>
          </div>
        ) : <KnowledgeGraph3D term={term} />}
      </div>

      {/* ── TOP-LEFT: Header ── */}
      <div className="absolute top-20 left-4 z-30 max-w-[calc(100vw-2rem)] pointer-events-none">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-3 border-l-4 border-l-indigo-500 pointer-events-auto shadow-lg">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Knowledge Topology</div>
            <h1 className="text-lg font-display text-gray-900 dark:text-white capitalize truncate">{decodeURIComponent(term)}</h1>
          </div>
          <button
            onClick={() => navigate('/terminology')}
            className="ml-2 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">home</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT: Node info panel — scrollable on small screens ── */}
      {selectedNode && (
        <div className="absolute top-20 right-4 z-30 w-64 lg:w-72 max-h-[calc(100dvh-5rem)] overflow-y-auto pointer-events-none">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-xl pointer-events-auto">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-semibold tracking-widest text-gray-400 dark:text-gray-500">Selected Node</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                selectedNode.type === 'disease' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 border-rose-200 dark:border-rose-700' :
                selectedNode.type === 'symptom' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 border-amber-200 dark:border-amber-700' :
                selectedNode.type === 'drug' ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 border-cyan-200 dark:border-cyan-700' :
                'bg-violet-50 dark:bg-violet-900/30 text-violet-500 border-violet-200 dark:border-violet-700'
              }`}>{selectedNode.type}</span>
            </div>
            <h2 className="text-lg font-display text-gray-900 dark:text-white mb-3">{selectedNode.label}</h2>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 min-h-[60px] border border-gray-100 dark:border-gray-700/50">
              {isLoadingExplanation ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {explanationData?.explanation || "Select a node to query context."}
                </p>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
              <button
                onClick={() => navigate(`/graph/${encodeURIComponent(selectedNode.label)}`)}
                className="w-full py-2.5 bg-gray-900 dark:bg-indigo-600 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-indigo-500 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">account_tree</span> Explore Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM-LEFT: Legend — wraps on mobile ── */}
      <div className="absolute bottom-4 left-4 z-30 max-w-[calc(100vw-2rem)]">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 rounded-xl shadow-lg font-inter">
          {[
            { label: 'Disease', color: 'bg-rose-500' },
            { label: 'Symptom', color: 'bg-amber-500' },
            { label: 'Drug', color: 'bg-cyan-400' },
            { label: 'Concept', color: 'bg-violet-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`}></span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM-CENTER: Hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden sm:block">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-sm">mouse</span>
          Hover • Click • Double-Click to Expand
        </p>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;
