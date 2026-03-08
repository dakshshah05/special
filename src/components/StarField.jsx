import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aPhase;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase + position.z * 0.5);
  gl_PointSize = aSize * uPixelRatio * twinkle * (200.0 / -mvPosition.z);
  gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = twinkle;
}
`;

const fragmentShader = `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, alpha * 0.8);
}
`;

export default function StarField({ count = 5000 }) {
  const pointsRef = useRef();

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread stars in a large sphere
      const radius = 5 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 20;

      sizes[i] = Math.random() * 3 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, phases };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uColor: { value: new THREE.Color('#ffffff') },
  }), []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          array={phases}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
