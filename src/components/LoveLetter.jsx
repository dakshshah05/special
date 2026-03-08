import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="love-letter-wrapper" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <button 
        className="letter-button interactive" 
        onClick={() => setIsOpen(true)}
        style={{
            padding: '1.5rem 3rem',
            fontSize: '1.2rem',
            background: 'linear-gradient(45deg, #ff6eb4, #e8c4ff)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255, 110, 180, 0.4)',
            transition: 'all 0.3s ease'
        }}
      >
        Click here for Daksh's Personalized note 💌
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
                background: 'rgba(10, 0, 16, 0.95)',
                zIndex: 20000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}
          >
            <motion.div 
              className="letter-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{
                  background: '#fff5e6',
                  color: '#2d1b4e',
                  padding: '3rem',
                  borderRadius: '10px',
                  maxWidth: '600px',
                  width: '100%',
                  position: 'relative',
                  backgroundImage: 'radial-gradient(#d4b895 0.5px, transparent 0.5px)',
                  backgroundSize: '20px 20px',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  maxHeight: '80vh',
                  overflowY: 'auto'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#ff6eb4'
                }}
              >
                ✕
              </button>

              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'left' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold', color: '#ff6eb4' }}>
                  My Dearest Shariya, 🌹
                </p>
                
                <p>
                  Today, as you complete 20 beautiful years on this earth, I wanted to take a moment to tell you how much your presence means to me. 
                </p>
                
                <p style={{ marginTop: '1rem' }}>
                  From the moment you entered my life, everything became more vibrant, more meaningful. Your smile is my daily dose of sunshine, and your support has been the anchor that kept me steady through every storm. 
                </p>
                
                <p style={{ marginTop: '1rem' }}>
                  You are not just a part of my life, Shariya — you are the heart of it. Your kindness, your intelligence, and the way you care for everyone around you make me fall in love with your soul over and over again. 
                </p>
                
                <p style={{ marginTop: '1rem' }}>
                  I am so incredibly proud of the woman you've become. Brave, brilliant, and absolutely breathtaking. I promise to be by your side as you conquer even more dreams in your twenties. 
                </p>
                
                <p style={{ marginTop: '1rem' }}>
                  Happy 20th Birthday, my love. May your day be as magical as the love you've given me. 
                </p>
                
                <p style={{ marginTop: '2rem', textAlign: 'right', fontWeight: 'bold' }}>
                  Yours always, <br/>
                  Daksh ❤️
                </p>
              </div>

              <div className="letter-decoration" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '2rem' }}>
                 🌸🦋✨💖✨🦋🌸
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
