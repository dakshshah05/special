import { useEffect, useRef } from 'react';

export function useScroll(callback) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (callback) {
        callback(window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);

  return lenisRef;
}
