import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const LoveMessage = () => {
  return (
    <div className="love-message-content">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        To My Beautiful Sky,
      </motion.h2>

      <motion.div 
        className="love-letter-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <p>Happy 20th Birthday! 🎉</p>
        <p>
          I wanted to make something special for you, something that shines even a fraction as bright as you do. 
          Thank you for always being my biggest supporter, my safe space, and my favorite reason to smile.
        </p>
        <p>
          Life is just better with you in it. You bring so much warmth, kindness, and magic into the world—and especially into mine.
        </p>
        <p>
          Here is to 20, to all the dreams you'll chase, and to everything beautiful coming your way. I'll always be cheering you on.
        </p>
      </motion.div>

      <motion.div 
        className="love-signature"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, delay: 4 }}
      >
        With all my love, always. 🤍
      </motion.div>
    </div>
  );
};

export default memo(function FinalSurprise() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <section className="section final-surprise-section" style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, var(--deep-void), #05000a)'
    }}>
      <motion.button 
        className="surprise-btn interactive"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="btn-text">Open if you love me 💌</span>
        <motion.div 
          className="btn-glow"
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="love-modal-overlay"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 1 }}
          >
            {/* Background floating hearts/petals effect can go here via CSS */}
            <div className="love-modal-bg" />

            <button className="love-modal-close interactive" onClick={() => setIsOpen(false)}>
              ✕
            </button>

            <motion.div 
              className="love-modal-card"
              initial={{ scale: 0.9, y: 50, opacity: 0, rotateX: -10 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, y: 50, opacity: 0, rotateX: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <LoveMessage />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});
