'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Types
type BalloonColor = 'silver' | 'gunmetal' | 'bubble'

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
    { position: [1.05, 0.10, -0.05], radius: 0.18, color: 'bubble' },
    { position: [-1.02, -0.05, 0.10], radius: 0.16, color: 'gunmetal' },
    { position: [-0.05, 1.08, 0.00], radius: 0.20, color: 'silver' },
    { position: [0.10, -1.05, -0.05], radius: 0.15, color: 'gunmetal' },
    { position: [0.00, -0.10, 1.10], radius: 0.19, color: 'bubble' },
    { position: [0.05, 0.05, -1.08], radius: 0.17, color: 'silver' },

    // Micro Fillers for decoration
    { position: [0.70, 0.80, 0.00], radius: 0.12, color: 'gunmetal' },
    { position: [-0.75, 0.00, 0.95], radius: 0.14, color: 'silver' },
    { position: [0.20, -0.85, 1.00], radius: 0.13, color: 'silver' },
]

const COLORS: Record<BalloonColor, string> = {
    silver: '#CBCBCB',
    gunmetal: '#323232',
    bubble: '#FFFFFF',
}

// Single Balloon Mesh
const BalloonMesh = ({ def }: { def: BalloonDef }) => {
    const isBubble = def.color === 'bubble'

    return (
        // 气泡不应该投射死黑的阴影，所以 castShadow 取决于它是不是气泡
        <mesh position={def.position} castShadow={!isBubble} receiveShadow>
            <sphereGeometry args={[def.radius, 64, 64]} />

            {isBubble ? (
                // Bubble Material
                <meshPhysicalMaterial
                    color="#ffffff"          // Basic color of the transmission light
                    transmission={1}         // Fully transmission like the bubble
                    transparent={true}
                    roughness={0.05}         // Smooth surface
                    ior={1.33}                // As the refractive index of soap film
                    thickness={0.1}          // Simulate the thin film thickness, affecting the refraction calculation
                    envMapIntensity={3.0}    // Reflection strength 
                    clearcoat={1}            // Enhance the reflection
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

// --- Animated Cluster Group ---
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

// --- Canvas Root ---
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
            {/* --- 核心交互注入 --- */}
            <OrbitControls
                enableZoom={false}       // 纪律：禁止滚轮缩放，防止破坏布局比例
                enablePan={false}        // 纪律：禁止右键平移，防止气球飞出视口
                enableDamping={true}     // 开启物理阻尼（惯性滑行）
                dampingFactor={0.05}     // 阻尼系数，0.05 是一种非常顺滑、有重量感的数值
            // autoRotate={true}        // 可选：开启极其缓慢的全局自转
            // autoRotateSpeed={0.5}    // 自转速度设定
            />
            <ambientLight intensity={0.40} />

            {/* Key Light — 彻底修复阴影锯齿的核心战场 */}
            <directionalLight
                position={[-3, 4, 3]}
                intensity={1.8}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]} // 1. 提升贴图硬解析度
                shadow-bias={-0.0005}         // 2. 致命魔法：微调深度偏移，彻底干掉曲面自阴影（Shadow Acne）
            >
                {/* 3. 约束阴影相机包围盒，将 2048 像素极致压缩在集群正上方，防止像素浪费 */}
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
