'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCursorStore } from '@/hooks/useCursorStore'

// Raw structural GLSL optimized to fold parametric mesh grids softly.
const vertexShader = `
uniform float uTime;
attribute float aSize;
attribute vec3 aColor;
attribute float aRandom; // Represents ribbon index for phase offset

varying vec3 vColor;
varying float vAlpha;

// Standard 3D Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
    vColor = aColor;
    vec3 pos = position;

    float t = uTime * 0.12; // Sluggish, majestic ocean flow
    
    // Scale down space coordinate to get massive sweeping folds instead of crinkled noise
    vec3 flowPos = pos * 0.35;
    
    // Apply macroscopic gentle waves acting constantly across the mesh
    float n1 = snoise(vec3(flowPos.x, flowPos.y + t, flowPos.z + aRandom * 4.0));
    float n2 = snoise(vec3(flowPos.x + aRandom * 3.0, flowPos.y, flowPos.z - t));
    float n3 = snoise(vec3(flowPos.x - t, flowPos.y + aRandom * 2.0, flowPos.z));
    
    vec3 distortion = vec3(n1, n2, n3);
    
    // Displacement mapped to ribbon twisting folds
    pos += distortion * 3.2;

    // Additional global torsion that intertwines the separated ribbon meshes securely
    float twist = snoise(vec3(pos.y * 0.15 + t * 0.25, pos.z * 0.15, aRandom));
    float c = cos(twist * 2.2);
    float s = sin(twist * 2.2);
    mat2 rotXYZ = mat2(c, -s, s, c);
    
    pos.xy = rotXYZ * pos.xy;
    pos.xz = rotXYZ * pos.xz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Consistent size relative to depth
    gl_PointSize = aSize * (500.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Silky fade avoiding sharp edge clipping
    vAlpha = smoothstep(11.0, 0.0, length(pos));
}
`

const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if (ll > 0.5) discard;
    
    // Radial softening
    float strength = pow((0.5 - ll) * 2.0, 1.5);
    
    gl_FragColor = vec4(vColor, strength * vAlpha);
}
`

const DynamicNebula = () => {
    const shaderRef = useRef<THREE.ShaderMaterial>(null)
    const pointsRef = useRef<THREE.Points>(null)

    const particleGeometry = useMemo(() => {
        const ribbons = 7
        const count = 280000 // Dense structural grid size
        const pointsPerRibbon = Math.floor(count / ribbons)

        const geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const randoms = new Float32Array(count)

        // Palette extracted from the cold icy/electric blue aesthetic
        const colorCore = new THREE.Color("#ffffff")
        const colorInner = new THREE.Color("#88d2ff") // Electric cyan highlights
        const colorMid = new THREE.Color("#1850e0")   // Vivid energetic blue
        const colorOuter = new THREE.Color("#0c1445") // Deep void structure blue

        let index = 0
        for (let r = 0; r < ribbons; r++) {

            // Give each starting plane structured looping layouts
            const ribbonTwist = (r / ribbons) * Math.PI * 2
            const ribbonRadius = 0.5 + Math.random() * 0.8 // Closer core binding

            for (let i = 0; i < pointsPerRibbon; i++) {
                // Progression along the length
                const u = Math.random()

                // --- GAUSSIAN DISTRIBUTION FOR EXTREME DENSITY ALONG SPINE ---
                // Generates extremely packed core centers with exponentially sparser clouds outwardly
                const v1 = Math.random()
                const v2 = Math.random()
                let distNormal = Math.sqrt(-2.0 * Math.log(v1)) * Math.cos(2.0 * Math.PI * v2)

                // Limit severe outliers to keep the bounding volume sane
                distNormal = Math.max(-3.5, Math.min(3.5, distNormal))

                const radialOffset = distNormal * 0.45 // width multiplier bounding the central spine scatter

                // Natively form a spiraling tubular line
                const baseAngle = ribbonTwist + u * Math.PI * 2.8

                // Pure exact spine coordinate
                const spineX = Math.cos(baseAngle) * ribbonRadius
                const spineY = Math.sin(baseAngle) * ribbonRadius
                const spineZ = (u - 0.5) * 12.0 // Deep long structural span

                // Surround the spine mathematically
                const randomAngle = Math.random() * Math.PI * 2

                const x = spineX + Math.cos(randomAngle) * radialOffset * 1.5
                const y = spineY + Math.sin(randomAngle) * radialOffset * 1.5
                const z = spineZ + (Math.random() - 0.5) * Math.abs(radialOffset) * 0.85

                positions[index * 3] = x
                positions[index * 3 + 1] = y
                positions[index * 3 + 2] = z

                // Map colormetrics directly radiating from the central spine outward
                const distFromSpine = Math.abs(radialOffset)

                const mixedColor = new THREE.Color()

                if (distFromSpine < 0.2) {
                    mixedColor.lerpColors(colorCore, colorInner, distFromSpine / 0.2)
                } else if (distFromSpine < 0.7) {
                    mixedColor.lerpColors(colorInner, colorMid, (distFromSpine - 0.2) / 0.5)
                } else {
                    mixedColor.lerpColors(colorMid, colorOuter, (distFromSpine - 0.7) / 2.8)
                }

                colors[index * 3] = mixedColor.r
                colors[index * 3 + 1] = mixedColor.g
                colors[index * 3 + 2] = mixedColor.b

                // Node sizing: large intense flares bounded by ultra-fine interference dust
                sizes[index] = distFromSpine < 0.22 ? 0.046 : 0.02
                if (Math.random() > 0.99) sizes[index] *= (4.0 + Math.random() * 3.0)

                // Track the ribbon object index to be displaced synchronously
                randoms[index] = r / ribbons

                index++
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        return geometry
    }, [])

    useFrame((state) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
        }
        if (pointsRef.current) {
            // Apply macro orbit to showcase the overlapping ribbon layers
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
            pointsRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.05

            // Removed Pointer Parallax (Task Requirement)
        }
    })

    useFrame((state) => {
        // [核心纪律] 瞬态读取：不使用 Hook 订阅，绝不触发组件 Render
        const { nx, ny } = useCursorStore.getState()

        // 强制覆盖 R3F 原生事件坐标（因为我们在外层接管了光标系统）
        state.pointer.set(nx, ny)

        // 如果你的场景需要物理点击或射线检测，必须在每帧主动更新 Raycaster
        state.raycaster.setFromCamera(state.pointer, state.camera)
        // --- 应用场景示例 ---
        // 如果想让粒子受光标排斥：
        // shaderRef.current.uniforms.uPointer.value.set(nx, ny)
    })


    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
    }), [])

    return (
        <points ref={pointsRef} geometry={particleGeometry} frustumCulled={false} scale={1.0}>
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

const OrganicNebula = () => {
    return (
        <div className="w-full h-full pointer-events-none">
            <Canvas
                // Widened FOV to 48 (wide-angle lens) to embrace the gigantic 1.8 scale shape entirely without hard border clipping
                camera={{ position: [0, 0, 14], fov: 38 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            >
                <DynamicNebula />
            </Canvas>
        </div>
    )
}

export default OrganicNebula;
