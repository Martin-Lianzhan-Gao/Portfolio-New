'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Particles = () => {
    const pointsRef = useRef<THREE.Points>(null)

    // Generate thousands of particles
    const particlesCount = 3000

    const positions = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount; i++) {
            // Golden ratio spiral distribution for a perfectly even sphere
            const phi = Math.acos(-1 + (2 * i) / particlesCount)
            const theta = Math.sqrt(particlesCount * Math.PI) * phi

            // Radius multiplier to create a slight "thick shell" rather than a perfectly sharp surface
            const r = 2 + (Math.random() - 0.5) * 0.1

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi) // x
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi) // y
            positions[i * 3 + 2] = r * Math.cos(phi) // z
        }

        return positions
    }, [particlesCount])

    useFrame((state, delta) => {
        if (!pointsRef.current) return

        const time = state.clock.getElapsedTime()
        
        // 1. Base autonomous rotation (the sphere's own continuous movement)
        const baseRotationX = time * 0.02
        const baseRotationY = time * 0.05
        
        // 2. Interactive parallax rotation based on mouse pointer
        // state.pointer holds normalized device coordinates (-1 to +1 x/y)
        // We multiply by a factor (e.g., 0.5) to control how far it tilts when the mouse reaches the screen edge.
        const targetRotationX = baseRotationX - (state.pointer.y * 0.5)
        const targetRotationY = baseRotationY + (state.pointer.x * 0.5)

        // 3. Smooth Damping (Easing)
        // Instead of snapping instantly to the target, we smoothly interpolate current rotation towards target
        // The last parameter (0.5) is the smoothing speed: lower = softer/slower/heavier, higher = snappier
        pointsRef.current.rotation.x = THREE.MathUtils.damp(pointsRef.current.rotation.x, targetRotationX, 0.5, delta)
        pointsRef.current.rotation.y = THREE.MathUtils.damp(pointsRef.current.rotation.y, targetRotationY, 0.5, delta)

        // Add a very subtle vertical breathing/floating effect
        pointsRef.current.position.y = Math.sin(time * 0.5) * 0.05
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesCount}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            {/* 
              Black particles looks fantastic on white.
              We keep the size small so it looks like fine dust/grain. 
            */}
            <pointsMaterial
                size={0.012}
                color="#000000"
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
            />
        </points>
    )
}

const ParticleSphere = () => {
    return (
        <div className="w-full h-full pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5.6], fov: 45 }}
                dpr={[1, 2]} // Optimize for high-DPI screens but cap at 2x for performance
                gl={{
                    alpha: true, // Transparent background so the white div shows through
                    antialias: true,
                }}
            >
                <Particles />
            </Canvas>
        </div>
    )
}

export default ParticleSphere
