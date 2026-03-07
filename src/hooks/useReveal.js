import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useReveal(options = {}) {
  const ref = useRef(null);
  const { 
    y = 60, 
    duration = 1, 
    delay = 0, 
    ease = 'power3.out',
    start = 'top 85%',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el, 
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}
