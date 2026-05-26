"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform sampler2D uCharMap;
uniform sampler2D uNoise;
uniform vec2 uResolution;
uniform float uAlpha;

varying vec2 vUv;

float hash(float a) {
  return fract(cos(sin(a)));
}

vec3 CodeLines(vec2 fragCoord, vec2 res, float reps, vec3 baseCol, float sm) {
  fragCoord.x -= mod(fragCoord.x, reps);
  float offset = sin(fragCoord.x * 15.0);
  float speed = (cos(fragCoord.x * 1.0) * 0.1 + sm);
  float vrep = hash(fragCoord.x);
  float y = fract((fragCoord.y / res.y) * vrep + offset + uTime * speed);
  return baseCol / max(y * 20.0, 0.001);
}

float Chars(vec2 fragCoord, float reps, vec2 res) {
  vec2 uv = mod(fragCoord.xy, reps) * 0.0625;
  vec2 id = fragCoord * 0.0625 - uv;
  vec2 noiseOffset = floor(texture(uNoise, id / 128.0 + uTime * 0.00002).xy * (reps * 2.0));
  uv += noiseOffset;
  uv *= 0.0625;
  uv.x = -uv.x;
  return texture(uCharMap, uv).r;
}

void main() {
  vec2 res = uResolution;
  vec2 fragCoord = vUv * res;
  vec3 col1 = CodeLines(fragCoord, res, 4.0, uColor1, 0.15) * Chars(fragCoord, 8.0, res);
  vec3 col2 = CodeLines(fragCoord, res, 8.0, uColor2, 0.25) * Chars(fragCoord, 16.0, res);
  vec3 col = col1 + col2;
  col *= (texture(uNoise, vUv).rgb * 2.0);
  col = clamp(col, 0.0, 1.0);
  float alpha = max(max(col.r, col.g), col.b) * uAlpha;
  gl_FragColor = vec4(col, alpha);
}
`

function generateCharMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = "#fff"
  ctx.font = "10px monospace"
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
  for (let i = 0; i < chars.length; i++) {
    const x = (i % 16) * 8
    const y = Math.floor(i / 16) * 8 + 8
    ctx.fillText(chars[i], x, y)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function generateNoise(): THREE.DataTexture {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size * 4; i++) data[i] = Math.random() * 255
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function ShaderQuad({ isDark }: { isDark: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { width, height } = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  const textures = useMemo(
    () => ({ charMap: generateCharMap(), noise: generateNoise() }),
    [],
  )

  const colors = useMemo(
    () => ({
      color1: isDark ? new THREE.Color("#22c55e") : new THREE.Color("#D4722A"),
      color2: isDark ? new THREE.Color("#16a34a") : new THREE.Color("#E55D2B"),
      alpha: isDark ? 0.8 : 0.35,
    }),
    [isDark],
  )

  useEffect(() => {
    if (!materialRef.current) return
    const u = materialRef.current.uniforms
    u.uColor1.value.copy(colors.color1)
    u.uColor2.value.copy(colors.color2)
    u.uAlpha.value = colors.alpha
  }, [colors])

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
            uColor1: { value: colors.color1.clone() },
            uColor2: { value: colors.color2.clone() },
            uCharMap: { value: textures.charMap },
            uNoise: { value: textures.noise },
            uResolution: {
              value: new THREE.Vector2(size.width, size.height),
            },
            uAlpha: { value: colors.alpha },
          }}
          transparent
          depthWrite={false}
        />
      </mesh>
  )
}

export function HeroShader() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, premultipliedAlpha: false }}
        camera={{ position: [0, 0, 1], fov: 45, near: 0.1, far: 10 }}
      >
        <ShaderQuad isDark={isDark} />
      </Canvas>
    </div>
  )
}
