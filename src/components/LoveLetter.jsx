import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(TextPlugin);

const fullMessage = `
My Dearest Shariya, 🌹

Today, as you complete 20 beautiful years on this earth, I wanted to take a moment to tell you how much your presence means to me. ✨

From the moment you entered my life, everything became more vibrant, more meaningful. Your smile is my daily dose of sunshine, and your support has been the anchor that kept me steady through every storm. ⚓

You are not just a part of my life, Shariya — you are the heart of it. Your kindness, your intelligence, and the way you care for everyone around you make me fall in love with your soul over and over again. ❤️

I am so incredibly proud of the woman you've become. Brave, brilliant, and absolutely breathtaking. I promise to be by your side as you conquer even more dreams in your twenties. 🚀

Happy 20th Birthday, my love. May your day be as magical as the love you've given me. 💝

Yours always,
Daksh ❤️
`;

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef(null);
  const parchmentRef = useRef(null);

  useEffect(() => {
    if (isOpen && textRef.current) {
        gsap.to(textRef.current, {
            text: fullMessage,
            duration: 15,
            ease: 'none',
            delay: 1,
            onUpdate: () => {
                // Scroll parchment as text grows
                if (parchmentRef.current) {
                    parchmentRef.current.scrollTop = parchmentRef.current.scrollHeight;
                }
            }
        });
    }
  }, [isOpen]);

  return (
    <div className="love-letter-wrapper" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <button 
        className="letter-button interactive" 
        onClick={() => setIsOpen(true)}
        style={{
            padding: '1.5rem 3rem',
            fontSize: '1.2rem',
            background: 'linear-gradient(45deg, var(--rose-pink), var(--lavender-glow))',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255, 110, 180, 0.4)',
            transition: 'all 0.3s ease'
        }}
      >
        Daksh's Personalized Hand-typed Note 💌
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="letter-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(10, 0, 16, 0.98)',
                zIndex: 20000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1000px'
            }}
          >
            {/* 3D Parchment Container */}
            <motion.div 
              ref={parchmentRef}
              className="parchment-container"
              initial={{ rotateX: 20, y: 100, scale: 0.9 }}
              animate={{ rotateX: 0, y: 0, scale: 1 }}
              exit={{ rotateX: 20, y: 100, scale: 0.9 }}
              style={{
                  background: 'ivory',
                  color: '#2b1b1b',
                  padding: '4rem',
                  borderRadius: '10px',
                  maxWidth: '700px',
                  width: '90%',
                  height: '80vh',
                  overflowY: 'auto',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.3rem',
                  lineHeight: '1.8',
                  position: 'relative',
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
                  border: '15px solid transparent',
                  borderImage: 'linear-gradient(45deg, #d4b895, #fff5e6) 30 stretch'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#8b4513', zIndex: 10 }}
              >
                ✕
              </button>

              <div ref={textRef} style={{ whiteSpace: 'pre-line', textAlign: 'left' }} />
              
              <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '2rem', filter: 'blur(0.5px)' }}>
                 🌸🦋✨💖✨🦋🌸
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
