import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Types
type SphereColor = 'silver' | 'gunmetal' | 'crystal'

type SphereDef = {
    position: [number, number, number]
    radius: number
    color: SphereColor
}


// Balloon Layout
const BALLOON_DEFS: SphereDef[] = [
    // Core Anchor: center of the cluster
    { position: [0.00, 0.00, 0.00], radius: 0.38, color: 'crystal' },

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
    { position: [-1.02, -0.05, 0.10], radius: 0.16, color: 'gunmetal' },
    { position: [-0.05, 1.08, 0.00], radius: 0.20, color: 'silver' },
    { position: [0.10, -1.05, -0.05], radius: 0.15, color: 'crystal' },
    { position: [0.00, -0.10, 1.10], radius: 0.19, color: 'gunmetal' },
    { position: [0.05, 0.05, -1.08], radius: 0.17, color: 'crystal' },

    // Micro Fillers for decoration
    { position: [0.70, 0.80, 0.00], radius: 0.12, color: 'crystal' },
    { position: [-0.75, 0.00, 0.95], radius: 0.14, color: 'crystal' },
    { position: [0.20, -0.85, 1.00], radius: 0.13, color: 'crystal' },
]

const COLORS: Record<SphereColor, string> = {
    silver: '#F3F4F6',
    gunmetal: '#565656',
    crystal: '#FFFFFF',
}

// Single Balloon Mesh
const SphereMesh = ({ def }: { def: SphereDef }) => {
    const isCrystal = def.color === 'crystal';
    const isSilver = def.color === 'silver';

    return (
        // CastShadow is false for crystal to prevent self-shadowing
        <mesh position={def.position} castShadow={!isCrystal} receiveShadow>
            <sphereGeometry args={[def.radius, 64, 64]} />

            {isCrystal ? (
                // Crystal Material
                <MeshTransmissionMaterial
                    color="#ffffff"
                    transmission={1}         // 100% transmission allowed
                    transparent={true}
                    roughness={0}            // Absolutely smooth
                    ior={1.6}                // Reflection Rate
                    thickness={1.0}          // Thickness of the material
                    envMapIntensity={3.5}    // Environment map intensity
                    attenuationColor="#ffffff"
                    attenuationDistance={1.8}  // Light attenuation distance
                    dispersion={4}         // Dispersion effect
                />
            ) : (
                // Material for other spheres
                <meshStandardMaterial
                    color={COLORS[def.color as keyof typeof COLORS]}
                    roughness={isSilver ? 0.88 : 1.6}
                    metalness={0.1}
                />
            )}
        </mesh>
    )
}

// Animated Cluster Group 
const ClusterGroup = ({ progressRef }: { progressRef: React.RefObject<number> }) => {
    // Reference the sphere cluster group
    const groupRef = useRef<THREE.Group>(null)
    const floatPhase = useMemo(() => Math.random() * Math.PI * 2, [])

    // Physics animation state management
    const targetRotation = useRef({ x: 0, y: 0 })
    const currentRotation = useRef({ x: 0, y: 0 })

    const { viewport } = useThree();

    // Extremely lightweight scroll listener
    useEffect(() => {
        // Initialise rotation angle based on scroll position
        const initY = window.scrollY * 0.0015
        const initX = window.scrollY * 0.0007
        // Set initial rotation angle to both target and current rotation for the first render
        targetRotation.current.y = initY
        targetRotation.current.x = initX
        currentRotation.current.y = initY
        currentRotation.current.x = initX

        const handleScroll = () => {
            // Update target rotation angle based on scroll position when scrolling
            targetRotation.current.y = window.scrollY * 0.0015
            targetRotation.current.x = window.scrollY * 0.0007
        }

        // Initialize directly to handle react strict mode running effect twice correctly
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Physics interpolation calculation in the rendering loop
    useFrame((state, delta) => {
        if (!groupRef.current) return

        const t = state.clock.getElapsedTime()

        const progress = progressRef.current

        // --- 核心：响应式缩放逻辑 ---

        // 1. 计算“70% 占比”下的极限缩放值
        // 集群直径约 2.6，所以缩放系数 = (视口短边 * 0.7) / 2.6
        const maxScale = (Math.min(viewport.width, viewport.height) * 0.7) / 2.6

        // 2. 初始缩放（小圆窗时期）建议为 maxScale 的 45%
        const startScale = maxScale * 0.45

        // 3. 线性插值
        const currentScale = startScale + (maxScale - startScale) * progress
        groupRef.current.scale.setScalar(currentScale)

        // Define the rotation behaviour by interpolating the current rotation to the target rotation with appropriate damping value
        currentRotation.current.y = THREE.MathUtils.lerp(
            currentRotation.current.y,
            targetRotation.current.y,
            delta * 3.5
        )
        currentRotation.current.x = THREE.MathUtils.lerp(
            currentRotation.current.x,
            targetRotation.current.x,
            delta * 3.5
        )

        // Self rotation on y-axis
        groupRef.current.rotation.y = currentRotation.current.y + t * 0.2
        // Self rotation on x-axis
        groupRef.current.rotation.x = currentRotation.current.x + Math.sin(t * 0.4) * 0.05

        // Float up and down on y-axis
        groupRef.current.position.y = Math.sin(t * 0.4 + floatPhase) * 0.06
    })
    return (
        <group ref={groupRef} scale={0.55}>
            {BALLOON_DEFS.map((def, i) => (
                <SphereMesh key={i} def={def} />
            ))}
        </group>
    )
}

// Canvas Root
const SphereCluster = ({ progressRef }: { progressRef: React.RefObject<number> }) => (
    <div className="w-full h-full">
        <Canvas
            camera={{ position: [0, 0, 5.5], fov: 38 }}
            dpr={[1, 2]}
            shadows
            gl={{
                alpha: true,
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
            }}
        >
            <ambientLight intensity={0.40} />

            {/* Key Light*/}
            <directionalLight
                position={[-3, 4, 3]}
                intensity={2.8}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]} // Increase shadow map resolution
                shadow-bias={-0.0005}         // Fine-tune depth bias to eliminate self-shadowing
            >
                {/* Constrain shadow camera frustum to the cluster's bounding box */}
                <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 10]} />
            </directionalLight>

            <directionalLight
                position={[4, -3, -4]}
                intensity={0.8}
                color="#b0c4de"
            />

            <pointLight position={[0, -5, -4]} intensity={0.8} color="#ffffff" />

            <ClusterGroup progressRef={progressRef} />
        </Canvas>
    </div>
)

export default SphereCluster;
