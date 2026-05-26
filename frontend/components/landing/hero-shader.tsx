"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

#define L length

vec4 tanh_custom(vec4 x) {
    vec4 e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
}

vec2 round_custom(vec2 x) {
    return floor(x + 0.5);
}

void main() {
  vec2 C = vUv * uResolution;
  vec4 o = vec4(0.0);
  
  float i = 0.0, z = 0.0, T = 0.1 * uTime + 9.0, d = T, j = 0.0;
  
  vec2 r = uResolution.xy;
  vec2 P = (C + C - r) / r.x;
  vec2 Y = vec2(5e-3, 1.0);
  
  vec4 U = vec4(0.0, 1.0, 2.0, 4.0);
  vec4 O = vec4(0.0);
  
  for(int iter = 0; iter < 39; iter++) {
    i += 1.0;
    if (!(i < 39.0 && d > 1e-4)) break;
    
    O = z * normalize(vec4(P, 2.0, 0.0)) - vec4(U.x, U.w, U.y, U.x) / 4.5;
    d = 1.0 - sqrt(L(O * O));
    z += d;
  }
  
  C = vec2(O.x, atan(O.z, O.y));
  
  P = vec2(U.z, U.y) * (P - (r.y / r.x) * vec2(U.x, U.y));
  O = vec4(4.0, 16.0, 99.0, 0.0) / (1e3 * dot(P, P) + 6.0);
  
  z = 5e-4;
  
  r = vec2(L(fwidth(C)) * U.y, L(fwidth(C)) * U.y);
  
  for(int iter2 = 0; iter2 < 9; iter2++) {
    j += 1.0;
    if (!(j < 9.0)) break;
    
    i = fract(sin(dot(vec2(round_custom(C / Y).x, j), 7.0 + vec2(U.x, U.w)) * 73.0));
    P = C - (T + T * i) * vec2(U.x, U.y);
    P -= round_custom(P / Y) * Y;
    
    o = 1.0 + sin(T + 7.0 * fract(8663.0 * i) + U);
    
    vec2 sm_arg = vec2(L(max(P, -vec2(U.y, U.x))), L(P) - z) - z;
    vec2 sm = smoothstep(r, -r, sm_arg);
    
    O += dot(sm, vec2(exp(19.0 * P.y), 3.0)) * o * o.w;
    
    C.x += Y.x / 8.0;
  }
  
  vec4 val = tanh_custom(O - 0.02 * vec4(U.z, U.w, U.y, U.y));
  o = sqrt(max(val, vec4(0.0)));
  
  gl_FragColor = vec4(o.rgb, 1.0);
}
`

function ShaderQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { width, height } = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    materialRef.current.uniforms.uResolution.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr,
    )
  })

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(size.width, size.height),
          },
        }}
        extensions={{ derivatives: true }}
        transparent={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export function HeroShader() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 1], fov: 45, near: 0.1, far: 10 }}
      >
        <ShaderQuad />
      </Canvas>
      {/* Translucent dimming layer */}
      <div className="pointer-events-none absolute inset-0 bg-black/60 dark:bg-black/70" />
    </div>
  )
}
