import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function PhysicsPlayground() {
  const sceneRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create();
    engine.gravity.y = 0; // Zero Gravity

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false
      }
    });

    // Boundaries
    const offset = 10;
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + offset, window.innerWidth, 50, { isStatic: true });
    const wallLeft = Bodies.rectangle(-offset, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
    const wallRight = Bodies.rectangle(window.innerWidth + offset, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
    const ceiling = Bodies.rectangle(window.innerWidth / 2, -offset, window.innerWidth, 50, { isStatic: true });

    // Floating Objects
    const hearts = Array.from({ length: 15 }, () => {
        return Bodies.circle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 30, {
            render: {
                fillStyle: '#ff6eb4',
                sprite: {
                    // Could use image here
                }
            },
            restitution: 0.9,
            frictionAir: 0.02
        });
    });

    const stars = Array.from({ length: 10 }, () => {
        return Bodies.polygon(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 5, 25, {
            render: { fillStyle: '#ffd700' },
            restitution: 1
        });
    });

    Composite.add(engine.world, [ground, wallLeft, wallRight, ceiling, ...hearts, ...stars]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <div style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <button 
                className="wish-button interactive" 
                onClick={() => setActive(!active)}
                style={{ background: 'var(--midnight-purple)' }}
            >
                {active ? 'Close Space Playground' : 'Launch Rocket to Physics Space 🚀'}
            </button>
        </div>
        
        {active && (
            <div 
                ref={sceneRef} 
                style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 20000, 
                    background: 'rgba(10, 0, 16, 0.9)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <div style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'white', pointerEvents: 'none' }}>
                    Throw objects around! 🪐 Space holds no gravity here.
                </div>
                <button 
                    onClick={() => setActive(false)} 
                    style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: '1px solid white', color: 'white', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', zIndex: 10 }}
                >
                    Back to Birthday
                </button>
            </div>
        )}
    </div>
  );
}
