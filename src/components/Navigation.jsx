import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home', target: 'hero' },
  { label: 'Story', target: 'timeline' },
  { label: 'Gallery', target: 'carousel' },
  { label: 'Message', target: 'message' },
  { label: 'Cake', target: 'cake' },
  { label: 'Wishes', target: 'wishes' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pillRef = useRef(null);
  const iconRef = useRef(null);

  // Magnetic hover effect
  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    const handleMouseMove = (e) => {
      const rect = pill.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        const strength = (80 - dist) / 80;
        gsap.to(pill, {
          x: dx * strength * 0.3,
          y: dy * strength * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(pill, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        ref={pillRef}
        className="nav-pill"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: isOpen ? '0px' : '4px', transition: 'gap 0.3s' }}>
          <span
            className="hamburger-line"
            style={{
              transform: isOpen ? 'rotate(45deg) translateY(1.5px)' : 'none',
              transition: 'transform 0.3s ease'
            }}
          />
          <span
            className="hamburger-line"
            style={{
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.2s ease'
            }}
          />
          <span
            className="hamburger-line"
            style={{
              transform: isOpen ? 'rotate(-45deg) translateY(-1.5px)' : 'none',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="nav-links">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.target}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span
                    className="nav-link interactive"
                    onClick={() => scrollTo(item.target)}
                  >
                    {item.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
