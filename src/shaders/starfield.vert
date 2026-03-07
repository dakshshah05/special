uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aPhase;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float dist = length(position.xy);
  float twinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase + position.z * 0.5);
  gl_PointSize = aSize * uPixelRatio * twinkle * (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = twinkle;
}
