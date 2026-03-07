import { useEffect, useRef } from 'react';

export function useCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let rafId = null;
    let isExpanded = false;
    let needsUpdate = true;
    
    // Trail particles tracking
    let lastSpawnTime = 0;

    const spawnTrailParticle = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'cursor-trail-particle';
      particle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      document.body.appendChild(particle);
      
      // Cleanup after animation
      setTimeout(() => {
        if (particle.parentNode) particle.remove();
      }, 700);
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      needsUpdate = true;
      
      const now = Date.now();
      // Drop a particle every ~30ms of movement to create a magical dust trail
      if (now - lastSpawnTime > 30) {
        spawnTrailParticle(mouseX, mouseY);
        lastSpawnTime = now;
      }
    };

    const onMouseOver = (e) => {
      const t = e.target;
      if (t.closest && (t.closest('button') || t.closest('a') || t.closest('.interactive'))) {
        if (!isExpanded) {
          isExpanded = true;
          cursor.classList.add('expanded');
        }
      }
    };

    const onMouseOut = (e) => {
      const t = e.target;
      if (t.closest && (t.closest('button') || t.closest('a') || t.closest('.interactive'))) {
        isExpanded = false;
        cursor.classList.remove('expanded');
      }
    };

    const animate = () => {
      if (needsUpdate) {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.transform = `translate3d(${curX - 10}px, ${curY - 10}px, 0)`;

        if (Math.abs(mouseX - curX) < 0.5 && Math.abs(mouseY - curY) < 0.5) {
          needsUpdate = false;
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return cursorRef;
}
