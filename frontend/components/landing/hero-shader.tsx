"use client"

import { useRef, useEffect } from "react"
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
    
    float dist = length(uv - offset);
    // Use smoothstep for softer circle edges instead of linear distance
    vec3 cir = vec3(smoothstep(0.8, 0.0, dist));
    // Create "slat" effect using fract, but soften the harsh drop-off with smoothstep
    float slatVal = fract(uv.x * 15.0);
    // Smoothly drop from 1 to 0 at the very edge to prevent aliasing/jitter
    float slat = slatVal * (1.0 - smoothstep(0.85, 1.0, slatVal));
    vec3 ran = vec3(slat * 0.5); // scale down the intensity a bit so it's not too dark
    
    col = cir + col - ran;
    
    gl_FragColor = vec4(col, 1.0);
}
`

function ShaderQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { width, height } = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.clientY / window.innerHeight);
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uResolution.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr,
    )
    
    // Smooth out mouse movement using lerp
    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x,
      mouse.current.x,
      0.05
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y,
      mouse.current.y,
      0.05
    );
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
