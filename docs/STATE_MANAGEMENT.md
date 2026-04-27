# State Management Architecture

The Medical Mentor Lite application utilizes **Zustand** for lightweight, decentralized state management.

## Store Structure (`useAppStore.js`)
- **Search State:** Tracks `searchTerm` and `debouncedTerm`.
- **Definition Data:** Houses definitions, pathophysiology, and clinical contexts fetched via API.
- **Graph State:** Stores `graphData` (nodes/edges) and tracking the currently `selectedNode` in the 3D visualizer.
- **Quiz Progress:** Complex nested object tracking exam config, current index, selected answers, and final scores.

## Best Practices
1. Avoid prop-drilling by directly pulling only required variables via the `useAppStore()` selector.
2. Ensure state actions (like `setGraphData`) are used instead of mutating state manually.
