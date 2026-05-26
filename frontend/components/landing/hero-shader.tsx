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
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 col = vec3(uv.x, 0.0, uv.y);
    vec2 offset = uMouse;
    vec3 cir = 1.0 - vec3(length(uv - offset)) - length(uv - offset);
    vec3 ran = vec3(fract(uv.x * 10.0));
    col = cir + col - ran;
    
    gl_FragColor = vec4(col, 1.0);
}
`

function ShaderQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { width, height } = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uResolution.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr,
    )
    materialRef.current.uniforms.uMouse.value.set(
      (state.pointer.x + 1) / 2,
      (state.pointer.y + 1) / 2
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
          uResolution: {
            value: new THREE.Vector2(size.width, size.height),
          },
          uMouse: {
            value: new THREE.Vector2(0.5, 0.5),
          }
        }}
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
