'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Types
type BalloonColor = 'silver' | 'gunmetal' | 'crystal'

type BalloonDef = {
    position: [number, number, number]
    radius: number
    color: BalloonColor
}


// Balloon Layout
const BALLOON_DEFS: BalloonDef[] = [
    // Core Anchor: center of the cluster
    { position: [0.00, 0.00, 0.00], radius: 0.38, color: 'gunmetal' },

    // Inner Shell: Large Spheres attached to the core anchor
    { position: [0.55, 0.50, 0.52], radius: 0.46, color: 'silver' },
    { position: [-0.50, 0.52, 0.55], radius: 0.45, color: 'gunmetal' },
    { position: [0.52, -0.55, 0.50], radius: 0.47, color: 'gunmetal' },
    { position: [-0.55, -0.50, 0.52], radius: 0.44, color: 'silver' },
    { position: [0.50, 0.55, -0.55], radius: 0.45, color: 'gunmetal' },
    { position: [-0.55, 0.50, -0.52], radius: 0.46, color: 'silver' },
    { position: [0.55, -0.52, -0.50], radius: 0.44, color: 'silver' },
    { position: [-0.52, -0.55, -0.55], radius: 0.47, color: 'gunmetal' },

    // Outer Shell: Small Satellites
    { position: [1.05, 0.10, -0.05], radius: 0.18, color: 'silver' },
    { position: [-1.02, -0.05, 0.10], radius: 0.16, color: 'crystal' },
    { position: [-0.05, 1.08, 0.00], radius: 0.20, color: 'silver' },
    { position: [0.10, -1.05, -0.05], radius: 0.15, color: 'gunmetal' },
    { position: [0.00, -0.10, 1.10], radius: 0.19, color: 'gunmetal' },
    { position: [0.05, 0.05, -1.08], radius: 0.17, color: 'silver' },

    // Micro Fillers for decoration
    { position: [0.70, 0.80, 0.00], radius: 0.12, color: 'gunmetal' },
    { position: [-0.75, 0.00, 0.95], radius: 0.14, color: 'silver' },
    { position: [0.20, -0.85, 1.00], radius: 0.13, color: 'crystal' },
]

const COLORS: Record<BalloonColor, string> = {
    silver: '#CBCBCB',
    gunmetal: '#323232',
    crystal: '#FFFFFF',
}

// Single Balloon Mesh
const BalloonMesh = ({ def }: { def: BalloonDef }) => {
    const isBubble = def.color === 'crystal'

    return (
        // CastShadow is false for bubble to prevent self-shadowing
        <mesh position={def.position} castShadow={!isBubble} receiveShadow>
            <sphereGeometry args={[def.radius, 64, 64]} />

            {isBubble ? (
                // Bubble Material
                <MeshTransmissionMaterial
                    color="#ffffff"
                    transmission={1}         // 100% transmission allowed
                    transparent={true}
                    roughness={0}            // Absolutely smooth
                    ior={1.6}                // Reflection Rate
                    thickness={1.0}          // Thickness of the material
                    envMapIntensity={2.5}    // Environment map intensity
                    attenuationColor="#ffffff"
                    attenuationDistance={1.8}  // Light attenuation distance
                    dispersion={2}         // Dispersion effect
                />
            ) : (
                // Material for other spheres
                <meshStandardMaterial
                    color={COLORS[def.color as keyof typeof COLORS]}
                    roughness={0.88}
                    metalness={0.0}
                />
            )}
        </mesh>
    )
}

// Animated Cluster Group 
const ClusterGroup = () => {
    const groupRef = useRef<THREE.Group>(null)
    const floatPhase = useMemo(() => Math.random() * Math.PI * 2, [])

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.getElapsedTime()
        // groupRef.current.rotation.y = t * 0.08
        // groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.08
        groupRef.current.position.y = Math.sin(t * 0.4 + floatPhase) * 0.06
    })

    return (
        <group ref={groupRef} scale={0.55}>
            {BALLOON_DEFS.map((def, i) => (
                <BalloonMesh key={i} def={def} />
            ))}
        </group>
    )
}

// Canvas Root
const BalloonCluster = () => (
    <div className="w-full h-full">
        <Canvas
            camera={{ position: [0, 0, 4.2], fov: 38 }}
            dpr={[1, 2]}
            shadows
            gl={{
                alpha: true,
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
            }}
        >
            {/* Core Interaction */}
            <OrbitControls
                enableZoom={false}       // Disable zoom to prevent layout distortion
                enablePan={false}        // Disable pan to prevent balloons from flying out of the viewport
                enableDamping={true}     // Enable damping for smooth, inertial movement
                dampingFactor={0.05}     // Set damping factor for smooth, weighted movement
            // autoRotate={true}        // Optional: Enable extremely slow global rotation
            // autoRotateSpeed={0.5}    // Set rotation speed
            />

            <ambientLight intensity={0.40} />

            {/* Key Light*/}
            <directionalLight
                position={[-3, 4, 3]}
                intensity={1.8}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]} // Increase shadow map resolution
                shadow-bias={-0.0005}         // Fine-tune depth bias to eliminate self-shadowing
            >
                {/* Constrain shadow camera frustum to the cluster's bounding box */}
                <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 10]} />
            </directionalLight>

            <directionalLight
                position={[3, -2, -4]}
                intensity={0.55}
                color="#b0c4de"
            />

            <pointLight position={[0, -4, 2]} intensity={0.25} color="#ffffff" />

            <ClusterGroup />
        </Canvas>
    </div>
)

export default BalloonCluster
