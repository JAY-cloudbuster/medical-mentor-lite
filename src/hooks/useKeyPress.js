import { useEffect } from 'react';

/**
 * Generic hook to attach keyboard shortcut listeners (e.g. 'Escape' to close modal).
 */
export function useKeyPress(targetKey, callback) {
  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        callback();
      }
    };
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);
}
