'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Types ---
type BalloonColor = 'silver' | 'gunmetal' | 'indigo'

type BalloonDef = {
    position: [number, number, number]
    radius: number
    color: BalloonColor
}


// --- Balloon Layout (磁力聚合与互斥间距版) ---
// 模拟物理场：所有球被原点(0,0,0)吸引，但由于排斥场存在，产生 0.05~0.1 的物理缝隙
const BALLOON_DEFS: BalloonDef[] = [
    // --- 核心层 (Core Anchor) ---
    // 放在绝对中心，作为万有引力的锚点，填补内部空洞
    { position: [0.00, 0.00, 0.00], radius: 0.38, color: 'gunmetal' },

    // --- 内壳层：大球体 (Inner Shell: Large Spheres) ---
    // 围绕中心形成一个松散的球体阵列，坐标向外推开，确保相互之间留有排斥间隙
    { position: [0.55, 0.50, 0.52], radius: 0.46, color: 'silver' }, // 右上前
    { position: [-0.50, 0.52, 0.55], radius: 0.45, color: 'gunmetal' }, // 左上前
    { position: [0.52, -0.55, 0.50], radius: 0.47, color: 'gunmetal' }, // 右下前
    { position: [-0.55, -0.50, 0.52], radius: 0.44, color: 'silver' }, // 左下前

    { position: [0.50, 0.55, -0.55], radius: 0.45, color: 'gunmetal' }, // 右上后 (与前排反色)
    { position: [-0.55, 0.50, -0.52], radius: 0.46, color: 'silver' }, // 左上后
    { position: [0.55, -0.52, -0.50], radius: 0.44, color: 'silver' }, // 右下后
    { position: [-0.52, -0.55, -0.55], radius: 0.47, color: 'gunmetal' }, // 左下后

    // --- 外壳层：小型卫星球体 (Outer Shell: Small Satellites) ---
    // 从各个方向被中心吸引，但被大球挡在外围，镶嵌在三维的凹槽缝隙中
    // X轴外围阻击
    { position: [1.05, 0.10, -0.05], radius: 0.18, color: 'silver' },
    { position: [-1.02, -0.05, 0.10], radius: 0.16, color: 'gunmetal' },
    // Y轴外围阻击
    { position: [-0.05, 1.08, 0.00], radius: 0.20, color: 'silver' },
    { position: [0.10, -1.05, -0.05], radius: 0.15, color: 'gunmetal' },
    // Z轴外围阻击
    { position: [0.00, -0.10, 1.10], radius: 0.19, color: 'gunmetal' },
    { position: [0.05, 0.05, -1.08], radius: 0.17, color: 'silver' },

    // --- 随机点缀的微型球 (Micro Fillers) ---
    // 增加画面细节，模仿参考图中那些极小的点缀
    { position: [0.70, 0.80, -0.20], radius: 0.12, color: 'gunmetal' },
    { position: [-0.75, -0.20, 0.75], radius: 0.14, color: 'silver' },
    { position: [0.20, -0.85, 0.70], radius: 0.13, color: 'silver' },
]

const COLORS: Record<BalloonColor, string> = {
    silver: '#CBCBCB',
    gunmetal: '#323232',
    indigo: '#2D1B6E',
}

// --- Single Balloon Mesh ---
const BalloonMesh = ({ def }: { def: BalloonDef }) => (
    <mesh position={def.position} castShadow receiveShadow>
        <sphereGeometry args={[def.radius, 64, 64]} />
        <meshStandardMaterial
            color={COLORS[def.color]}
            roughness={0.88} // 极佳的哑光质感参数
            metalness={0.0}
        />
    </mesh>
)

// --- Animated Cluster Group ---
const ClusterGroup = () => {
    const groupRef = useRef<THREE.Group>(null)
    const floatPhase = useMemo(() => Math.random() * Math.PI * 2, [])

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.getElapsedTime()
        groupRef.current.rotation.y = t * 0.08
        groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.08
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
