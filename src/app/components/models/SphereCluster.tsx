import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={1}
                    transparent={true}
                    roughness={0}
                    ior={1.6}
                    thickness={1.0}
                    envMapIntensity={3.5}
                    attenuationColor="#ffffff"
                    attenuationDistance={1.8}
                    dispersion={4}
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
const ClusterGroup = ({ progressRef, speedRef }: { progressRef: React.RefObject<number>, speedRef: React.RefObject<number> }) => {
    // Reference the sphere cluster group
    const groupRef = useRef<THREE.Group>(null)
    const floatPhase = useMemo(() => Math.random() * Math.PI * 2, [])

    // 用于保存跨帧平滑后的速度，以及由速度累加出的额外旋转角度
    const smoothedVelocity = useRef(0)
    const rotationOffset = useRef({ x: 0, y: 0 })

    const { viewport } = useThree();

    // Physics interpolation calculation in the rendering loop
    useFrame((state, delta) => {
        if (!groupRef.current) return

        const t = state.clock.getElapsedTime()

        const progress = progressRef.current

        // The original canvas height was effectively bounded by the width due to aspect-ratio (36% in landscape, 100% in portrait)
        // Since React Three Fiber maps FOV to canvas height, a taller full-screen canvas stretches the elements physically.
        // To precisely counteract this and maintain original screen-pixel proportions, we multiply by the ratio (oldHeight / newHeight).
        const isLandscape = viewport.width > viewport.height;
        const aspect = viewport.width / viewport.height;
        const compensation = isLandscape ? aspect * 0.3 : aspect * 1.0;

        // Base scale relies strictly on the constant viewport height to avoid double-shrinking when aspect ratio drops
        const maxScale = (viewport.height * 0.8 / 2.6) * compensation;

        // Calculate the initial scale based on the viewport size
        const startScale = maxScale * 0.7

        // Interpolate the current scale to the target scale
        const currentScale = startScale + (maxScale - startScale) * progress
        groupRef.current.scale.setScalar(currentScale)


        // ----------- 新增的真实物理惯性滚动旋转逻辑 -----------

        // 限制最大旋转动量，防止触控板暴力滑动导致速度飙升，引起视觉抽搐（轮辐错觉）
        const MAX_VELOCITY = 0.3;
        const targetVelocity = THREE.MathUtils.clamp(speedRef.current, -MAX_VELOCITY, MAX_VELOCITY);

        // 核心修复：自动衰减残留的物理速度！
        // 当你暴力滑动直接越过整个 Skills 区域到达底部时，ScrollTrigger 会取消激活并停止触发 onUpdate。
        // 这会导致被记录的最后一个极大速度永久卡在 speedRef.current 里，如果不自我衰减，球体会无限极速自转。
        speedRef.current = THREE.MathUtils.lerp(speedRef.current, 0, delta * 10);

        // 1. 平滑过渡速度 (Lerp): 实现滚动停止后依然带滑行的惯性
        // 使用 delta 控制 lerp 可保持阻尼在不同高刷屏上的体验一致
        smoothedVelocity.current = THREE.MathUtils.lerp(
            smoothedVelocity.current,
            targetVelocity,
            delta * 5 // 5 为阻尼系数，越小滑行越久，越大刹车越快
        );

        // 2. 速度积分累加偏移量: 速度是角度的变化量，必须不断累加
        // * delta 保证帧率独立；* 40 控制滚动在旋转上的力度放大系数
        rotationOffset.current.y += smoothedVelocity.current * delta * 40;
        rotationOffset.current.x += smoothedVelocity.current * delta * 15;

        // 3. 结果合并: 基础时间自传 + 滚动累加偏移
        groupRef.current.rotation.y = t * 0.6 + rotationOffset.current.y;
        groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.05 + rotationOffset.current.x;

        // Float up and down on y-axis, and shift the entire group down slightly (-0.25) to balance visual weight
        groupRef.current.position.y = Math.sin(t * 0.6 + floatPhase) * 0.06 - 0.25
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
const SphereCluster = ({ progressRef, speedRef }: { progressRef: React.RefObject<number>, speedRef: React.RefObject<number> }) => {
    // 视口可见性状态
    const [inView, setInView] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // 交叉观察器 (Intersection Observer)
    // 当这个 Canvas 容器完全离开用户屏幕时，将其标记为不可见
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { rootMargin: '100px 0px', threshold: 0 } // 上下留 100px 的余量以防边缘突然出现
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <Canvas
                frameloop={inView ? 'always' : 'demand'} // 不可见时完全挂起渲染循环 (0 CPU/GPU 消耗)
                camera={{ position: [0, 0, 5.5], fov: 38 }}
                dpr={[1, 1.5]}
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
                    shadow-mapSize={[1024, 1024]} // Reduced shadow map resolution for performance
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

                <ClusterGroup progressRef={progressRef} speedRef={speedRef} />
            </Canvas>
        </div>
    );
}

export default SphereCluster;

