# Component Hierarchy

## Pages
- `TerminologyExplorer.jsx`: Main hub for data fetching and definition rendering.
- `KnowledgeGraphPage.jsx`: The 3D container page providing absolute layout constraints.
- `QuizEngine.jsx`: Interactive state-machine component for medical exams.

## Key Sub-Components
- `KnowledgeGraph3D.jsx`: The React-Three-Fiber core renderer. Responsible for canvas lifecycle.
- `GlassPanel.jsx`: Reusable UI primitive that applies standard backdrop-blur styles.

## Services
- `apiService.js`: Defines pure functions for Axios REST calls.
- `graphService.js`: Specialized endpoints for the knowledge topology API.
