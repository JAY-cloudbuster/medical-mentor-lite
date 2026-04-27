import { useState, useEffect } from 'react';

/**
 * Custom hook to safely handle media queries inside React components.
 * Prevents hydration mismatches in SSR frameworks like Next.js, and offers clean responsive logic for React.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}
