/* eslint-disable no-unused-vars, react-hooks/purity, react-hooks/immutability, react-hooks/exhaustive-deps, react-hooks/rules-of-hooks */
import React from 'react';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const cursorRef = useCursor();

  return <div ref={cursorRef} className="custom-cursor" />;
}

