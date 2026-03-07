import React from 'react';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const cursorRef = useCursor();

  return <div ref={cursorRef} className="custom-cursor" />;
}
