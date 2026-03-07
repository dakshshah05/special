import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export function initGSAP(lenisInstance) {
  if (lenisInstance) {
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

export function createRevealAnimation(element, options = {}) {
  const defaults = {
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out',
    ...options
  };
  
  return gsap.from(element, {
    ...defaults,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });
}

export { gsap, ScrollTrigger };
