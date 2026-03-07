uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor, alpha);
}
