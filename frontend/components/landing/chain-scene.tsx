"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"

function Link({
  index,
  total,
  basePos,
  baseRot,
}: {
  index: number
  total: number
  basePos: THREE.Vector3
  baseRot: THREE.Euler
}) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const startDelay = (index / total) * 0.5

  useFrame((_, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const t = timeRef.current

    const assembled = Math.min(Math.max((t - startDelay) * 1.5, 0), 1)
    const eased = 1 - Math.pow(1 - assembled, 3)

    ref.current.position.lerp(basePos, eased * 0.06)
    ref.current.rotation.x += (baseRot.x - ref.current.rotation.x) * eased * 0.06
    ref.current.rotation.y += (baseRot.y - ref.current.rotation.y) * eased * 0.06
    ref.current.rotation.z += (baseRot.z - ref.current.rotation.z) * eased * 0.06

    const floatOffset = Math.sin(t * 0.5 + index * 0.4) * 0.04
    ref.current.position.y += floatOffset * 0.01

    if (glowRef.current) {
      const zipPhase = ((t * 0.35 + index / total) % 1)
      const zipGlow = Math.exp(-Math.pow((zipPhase - 0.5) * 5, 2))
      glowRef.current.scale.setScalar(1 + zipGlow * 0.5)
      if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity = 0.1 + zipGlow * 0.5
      }
    }
  })

  return (
    <group>
      <mesh ref={ref} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.07, 12, 24]} />
        <meshStandardMaterial
          color="#D4722A"
          metalness={0.6}
          roughness={0.25}
          envMapIntensity={1}
        />
      </mesh>
      <mesh ref={glowRef} position={basePos} rotation={baseRot}>
        <torusGeometry args={[0.36, 0.11, 12, 24]} />
        <meshBasicMaterial
          color="#E55D2B"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function Chain() {
  const total = 16
  const links = useMemo(() => {
    const result: { pos: THREE.Vector3; rot: THREE.Euler }[] = []
    for (let i = 0; i < total; i++) {
      const t = (i / (total - 1)) * 2 - 1
      const x = t * 2
      const y = Math.sin(t * 2.2) * 0.5 + Math.cos(t * 1.5) * 0.2
      const z = Math.cos(t * 1.6) * 0.4
      const rotY = t * 1.4 + Math.sin(t * 1.2) * 0.3
      const rotX = Math.sin(t * 1.8) * 0.4 + 0.3
      result.push({
        pos: new THREE.Vector3(x, y, z),
        rot: new THREE.Euler(rotX, rotY, 0),
      })
    }
    return result
  }, [total])

  const groupRef = useRef<THREE.Group>(null)
  const groupTimeRef = useRef(0)
  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupTimeRef.current += delta
    const t = groupTimeRef.current
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.25
    groupRef.current.position.y = Math.sin(t * 0.18) * 0.06
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-3, -1, -4]} intensity={0.5} />
      {links.map((link, i) => (
        <Link
          key={i}
          index={i}
          total={total}
          basePos={link.pos}
          baseRot={link.rot}
        />
      ))}
    </group>
  )
}

export function ChainScene() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.3, 3.8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[isDark ? "#0a0a0a" : "#faf6f0"]} />
        <Chain />
      </Canvas>
    </div>
  )
}
