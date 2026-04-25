import { create } from 'zustand';

const useAppStore = create((set) => ({
  moduleActive: 'Pathology v2.4',
  setModuleActive: (module) => set({ moduleActive: module }),
  
  // Terminology Engine State
  searchTerm: '',
  setSearchTerm: (query) => set({ searchTerm: query }),
  correctedTerm: null,
  setCorrectedTerm: (term) => set({ correctedTerm: term }),
  definitionData: null,
  setDefinitionData: (data) => set({ definitionData: data }),
  relatedTerms: [],
  setRelatedTerms: (terms) => set({ relatedTerms: terms }),
  youtubeVideos: [],
  setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
  
  // Quiz Configurator State
  quizConfig: {
    topic: 'Pathology',
    difficulty: 'Medium',
    timeLimit: 10,
    numQuestions: 6,
  },
  setQuizConfig: (config) => set((state) => ({ quizConfig: { ...state.quizConfig, ...config } })),

  // Quiz Engine State
  quizData: null,
  setQuizData: (data) => set({ quizData: data }),
  quizProgress: {
    index: 0,
    score: 0,
    isComplete: false
  },
  updateQuizProgress: (progress) => set((state) => ({ quizProgress: { ...state.quizProgress, ...progress } })),
  selectedAnswer: null,
  setSelectedAnswer: (id) => set({ selectedAnswer: id }),
  resetQuizState: () => set({ quizProgress: { index: 0, score: 0, isComplete: false }, selectedAnswer: null }),

  // Anatomy Visualizer State
  selectedGender: 'female',
  setSelectedGender: (gender) => set({ selectedGender: gender }),
  anatomyLayer: { skeletal: true, muscular: false, nervous: false, organs: true },
  toggleAnatomyLayer: (layer) => set((state) => ({ anatomyLayer: { ...state.anatomyLayer, [layer]: !state.anatomyLayer[layer] } })),
  selectedOrgan: null,
  setSelectedOrgan: (organ) => set({ selectedOrgan: organ }),

  // Knowledge Graph State
  graphData: null,
  setGraphData: (data) => set({ graphData: data }),
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  loadingGraph: false,
  setLoadingGraph: (status) => set({ loadingGraph: status }),
}));

export default useAppStore;
