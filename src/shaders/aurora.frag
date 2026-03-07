uniform float uTime;
varying vec2 vUv;

// Simple noise function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  
  float wave1 = sin(uv.y * 6.0 + uTime * 0.5 + uv.x * 2.0) * 0.5 + 0.5;
  float wave2 = sin(uv.y * 10.0 - uTime * 0.3 + uv.x * 3.0) * 0.5 + 0.5;
  float wave3 = sin(uv.y * 4.0 + uTime * 0.7) * 0.5 + 0.5;
  
  float n = noise(uv * 4.0 + uTime * 0.2);
  
  float pattern = (wave1 + wave2 + wave3) / 3.0 + n * 0.3;
  
  vec3 purple = vec3(0.102, 0.02, 0.2);
  vec3 rosePink = vec3(1.0, 0.431, 0.706);
  vec3 lavender = vec3(0.91, 0.769, 1.0);
  
  vec3 color = mix(purple, rosePink, pattern * uv.x);
  color = mix(color, lavender, pattern * 0.3);
  
  float alpha = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y) * 0.4;
  alpha *= pattern;
  
  gl_FragColor = vec4(color, alpha);
}
