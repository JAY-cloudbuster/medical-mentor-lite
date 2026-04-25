import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import GlassPanel from '../components/ui/GlassPanel';
import KnowledgeGraph3D from '../components/KnowledgeGraph3D';
import { fetchGraph, fetchNodeInfo } from '../services/graphService';
import useAppStore from '../store/useAppStore';

const KnowledgeGraphPage = () => {
  const { term } = useParams();
  const navigate = useNavigate();
  const { setGraphData, selectedNode, setSelectedNode, loadingGraph, setLoadingGraph } = useAppStore();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['graph', term],
    queryFn: async () => {
      return await fetchGraph(term);
    },
    enabled: !!term
  });

  // Query for getting side-panel node explanation
  const { data: explanationData, isLoading: isLoadingExplanation } = useQuery({
    queryKey: ['nodeExplain', selectedNode?.label],
    queryFn: () => fetchNodeInfo(selectedNode?.label),
    enabled: !!selectedNode
  });

  useEffect(() => {
    if (data) {
       setGraphData(data);
       // Select central node by default
       const centralNodeIndex = data.nodes.findIndex(n => n.label.toLowerCase() === term.toLowerCase());
       if (centralNodeIndex !== -1) {
           setSelectedNode(data.nodes[centralNodeIndex]);
       } else if (data.nodes.length > 0) {
           setSelectedNode(data.nodes[0]);
       }
    }
    return () => {
        setGraphData(null);
        setSelectedNode(null);
    }
  }, [data, term, setGraphData, setSelectedNode]);

  return (
    <div className="h-screen w-full relative flex overflow-hidden bg-background font-body text-on-surface">
      {/* 3D Canvas Area */}
      <div className="absolute inset-0 cursor-crosshair z-0 container-for-canvas">
        {isLoading || isFetching ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 w-full h-full bg-background/80 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(67,243,246,0.6)]"></div>
                <h2 className="font-headline text-xl text-on-surface animate-pulse">Synthesizing Neural Graph...</h2>
                <p className="text-sm text-on-surface-variant font-mono mt-2">Connecting medical topologies for '{term}'</p>
            </div>
        ) : isError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center font-headline text-error">
                <span className="material-symbols-outlined text-5xl mb-4">error</span>
                <h2>Graph processing failed. Please try another term.</h2>
            </div>
        ) : (
             <KnowledgeGraph3D term={term} />
        )}
      </div>

      {/* Floating Header */}
      <div className="absolute top-8 left-8 z-30 pointer-events-none">
        <GlassPanel className="px-6 py-4 rounded-xl flex items-center gap-4 border-l-4 border-primary pointer-events-auto shadow-2xl">
            <div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Knowledge Topology</div>
                <h1 className="text-2xl font-headline font-bold text-on-surface capitalize">{term}</h1>
            </div>
            <button onClick={() => navigate('/terminology')} className="ml-4 p-2 bg-surface hover:bg-surface-variant rounded-full transition-colors text-slate-300">
                <span className="material-symbols-outlined text-sm">home</span>
            </button>
        </GlassPanel>
      </div>

      {/* Right Side Info Panel */}
      {selectedNode && (
        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-80 z-30 pointer-events-none">
          <GlassPanel className="p-6 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto transform transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-outline">Selected Node</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedNode.type === 'disease' ? 'bg-error/20 text-error' :
                    selectedNode.type === 'symptom' ? 'bg-yellow-500/20 text-yellow-500' :
                    selectedNode.type === 'drug' ? 'bg-primary/20 text-primary' :
                    'bg-tertiary/20 text-tertiary'
                }`}>
                    {selectedNode.type}
                </span>
            </div>
            
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">{selectedNode.label}</h2>
            
            <div className="bg-surface-container/50 rounded-xl p-4 min-h-[100px] border border-white/5">
                {isLoadingExplanation ? (
                    <div className="animate-pulse flex flex-col gap-2">
                        <div className="h-3 bg-white/10 rounded w-full"></div>
                        <div className="h-3 bg-white/10 rounded w-4/5"></div>
                        <div className="h-3 bg-white/10 rounded w-full"></div>
                    </div>
                ) : (
                    <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                        {explanationData?.explanation || "Select a node to query deep medical context."}
                    </p>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-3">
                <button 
                  onClick={() => navigate(`/graph/${encodeURIComponent(selectedNode.label)}`)} 
                  className="w-full py-3 bg-surface hover:bg-surface-variant rounded-xl text-sm font-bold border border-white/10 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    Explore This Branch
                </button>
            </div>
          </GlassPanel>
        </div>
      )}
      
      {/* Legend Map */}
      <GlassPanel className="absolute bottom-6 left-8 z-30 flex items-center gap-6 px-6 py-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error" style={{ boxShadow: '0 0 10px #ff50fc' }}></span>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Disease</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 10px #eab308' }}></span>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Symptom</span>
          </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" style={{ boxShadow: '0 0 10px #43f3f6' }}></span>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Drug</span>
          </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-tertiary" style={{ boxShadow: '0 0 10px #bf81ff' }}></span>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Concept</span>
          </div>
      </GlassPanel>

      {/* Dynamic Interaction Help Text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
          <p className="text-xs font-bold text-outline animate-pulse tracking-widest uppercase flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">mouse</span> Hover to Highlight • Click to Inspect • Double-Click to Expand
          </p>
      </div>

    </div>
  );
};

export default KnowledgeGraphPage;
