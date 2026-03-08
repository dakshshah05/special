import { useEffect, useRef, useCallback } from 'react';

export function useCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const expandedRef = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || 
          target.classList.contains('interactive') || target.closest('button') || target.closest('a')) {
        expandedRef.current = true;
        cursor.classList.add('expanded');
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || 
          target.classList.contains('interactive') || target.closest('button') || target.closest('a')) {
        expandedRef.current = false;
        cursor.classList.remove('expanded');
      }
    };

    const onClick = (e) => {
      // Create burst particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-burst';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 / 8) * i;
        const velocity = 30 + Math.random() * 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], { duration: 500, easing: 'ease-out' });

        setTimeout(() => particle.remove(), 500);
      }
    };

    let animId;
    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.1);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.1);
      cursor.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('click', onClick);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return cursorRef;
}
