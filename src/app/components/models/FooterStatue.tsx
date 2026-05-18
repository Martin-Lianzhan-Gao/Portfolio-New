'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

/** Inner scene component — renders the statue mesh with slow idle rotation */
function Statue({ isVisibleRef }: { isVisibleRef: React.RefObject<boolean> }) {
    const { scene } = useGLTF('/models/statue-socrates-blue.glb')
    const spinRef = useRef<THREE.Group>(null)

    // Override material to eliminate oily/shiny look
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
                if (mat.isMeshStandardMaterial) {
                    // Force matte surface — strip maps that override scalar values
                    mat.roughness = 1.0
                    mat.roughnessMap = null
                    mat.metalness = Math.min(mat.metalness, 0.1)
                    mat.metalnessMap = null
                    mat.envMapIntensity = 0.15

                    // Kill clearcoat if MeshPhysicalMaterial
                    if ('clearcoat' in mat) {
                        (mat as THREE.MeshPhysicalMaterial).clearcoat = 0;
                        (mat as THREE.MeshPhysicalMaterial).clearcoatRoughness = 1
                    }

                    mat.needsUpdate = true
                }
            }
        })
    }, [scene])

    // Counter-clockwise self-rotation around the model's own (tilted) Y-axis
    useFrame((state, delta) => {
        if (!isVisibleRef.current) return
        state.invalidate()
        if (spinRef.current) {
            // Clamp delta to prevent jump when resuming from off-screen pause
            const clampedDelta = Math.min(delta, 1 / 30)
            spinRef.current.rotation.y -= clampedDelta * 1.5
        }
    })

    return (
        // Outer group: 20° rightward tilt, shifted left to prevent right-side clipping
        <group scale={1.4} position={[-0.2, -1.3, 0]} rotation={[0, 0, -Math.PI / 9]}>
            {/* Inner group: rotates around its own local Y-axis */}
            <group ref={spinRef}>
                <primitive object={scene} />
            </group>
        </group>
    )
}

/** Footer decoration — 3D Socrates bust */
const FooterStatue = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const isVisibleRef = useRef(true)

    // IntersectionObserver: pause rendering when off-screen
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting },
            { threshold: 0, rootMargin: '200px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-[24vw] lg:w-[22vw] xl:w-[18vw] 2xl:w-[15.5vw] h-[33vw] lg:h-[31vw] xl:h-[24vw] 2xl:h-[20vw] pointer-events-none"
        >
            <Canvas
                frameloop="demand"
                camera={{ position: [0, 0, 6], fov: 35 }}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance", toneMapping: 3 }}
                onCreated={({ gl }) => {
                    gl.outputColorSpace = THREE.SRGBColorSpace
                    gl.toneMappingExposure = 0.6
                }}
            >
                {/* Even indoor lighting — no directional shadows */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[0, 2, 5]} intensity={0.4} />
                <directionalLight position={[0, -1, 4]} intensity={0.4} />
                <Environment files="/hdris/studio_kontrast_04_1k.hdr" environmentIntensity={0.8} />
                <Statue isVisibleRef={isVisibleRef} />
            </Canvas>
        </div>
    )
}

// Preload the model
useGLTF.preload('/models/statue-socrates-blue.glb')

export default FooterStatue
