/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// Ambient Firework Background for the section itself
const CSSFireworks = memo(function CSSFireworks() {
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const speed = 60 + Math.random() * 100;
    return {
      id: i,
      tx: Math.cos(angle) * speed,
      ty: Math.sin(angle) * speed - 40,
      color: ['#ff6eb4', '#ffd700', '#e8c4ff', '#ffffff'][i % 4],
      delay: Math.random() * 0.5,
      size: 2 + Math.random() * 3,
    };
  });

  return (
    <div style={{ position: 'absolute', top: '30%', left: '50%', zIndex: 1 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', width: p.size, height: p.size,
          borderRadius: '50%', background: p.color,
          boxShadow: `0 0 8px ${p.color}`,
          animation: `firework 3s ease-out ${p.delay}s infinite`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
        }} />
      ))}
    </div>
  );
});

// The Interactive Wish Experience
const WishExperience = ({ onClose }) => {
  const [step, setStep] = useState('input'); // input -> wishing -> star -> complete
  const [wish, setWish] = useState('');
  
  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;
    
    // Sequence of events
    setStep('wishing');
    setTimeout(() => setStep('star'), 2500);
    setTimeout(() => setStep('complete'), 5500);
  };

  return (
    <motion.div className="wish-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1 }}>
        
      {/* Sky Background */}
      <div className="wish-sky" />

      {/* Close button */}
      <button className="wish-close interactive" onClick={onClose}>âœ•</button>

      <div className="wish-content">
        <AnimatePresence mode="wait">
          
          {step === 'input' && (
            <motion.div key="input" className="wish-step-input"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8 }}>
              <h2>Close your eyes. What do you wish for?</h2>
              <form onSubmit={handleWishSubmit}>
                <input 
                  type="text" 
                  value={wish} 
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Type your wish privately here..."
                  autoFocus
                  className="interactive"
                />
                <button type="submit" className="interactive" disabled={!wish.trim()}>
                  Whisper to the stars âœ¨
                </button>
              </form>
            </motion.div>
          )}

          {step === 'wishing' && (
            <motion.div key="wishing" className="wish-step-message"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }}>
              <h2>Sending it to the universe...</h2>
            </motion.div>
          )}

          {step === 'star' && (
            <motion.div key="star" className="shooting-star-container"
              initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
              <motion.div className="shooting-star"
                initial={{ x: '-10vw', y: '-10vh', scale: 0 }}
                animate={{ x: '110vw', y: '110vh', scale: 1 }}
                transition={{ duration: 2, ease: "easeIn" }}
              />
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div key="complete" className="wish-step-message"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}>
              <h2>A shining star heard you.</h2>
              <p>May all your dreams outgrow the universe, Shariya.</p>
              <p className="wish-signature">Happy 20th Birthday ðŸ¤</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(function WishesSection() {
  const [isWished, setIsWished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <section id="wishes" className="section wishes-section">
        {!showModal && <CSSFireworks />}
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h1 className="wishes-title">Happy 20th Birthday</h1>
          <div className="wishes-subtitle">Shariya âœ¦</div>
          
          <button 
            className="wish-button interactive" 
            onClick={() => setShowModal(true)}
          >
            {isWished ? 'Make Another Wish ðŸŒ ' : 'Make a Wish ðŸŒ '}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <WishExperience onClose={() => {
            setShowModal(false);
            setIsWished(true);
          }} />
        )}
      </AnimatePresence>
    </>
  );
});

