'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EclipseShaderMaterial = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#E67B4E') } // Intense Accent Orange
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying vec3 vPosition;

        // ---- Simplex 3D Noise (Ashima Arts) ----
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
            const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
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
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        // ---- End Noise ----
        
        void main() {
            // View vector for Fresnel
            vec3 viewVector = vec3(0.0, 0.0, 1.0);
            float dotProduct = dot(vNormal, viewVector);
            
            // Fresnel equation (1.0 at absolute edges, 0.0 at dead center)
            float fresnel = max(0.0, 1.0 - dotProduct);
            
            // Power multiplier to thicken the glowing ring. 
            // The smaller the power, the thicker the rim.
            float intensity = pow(fresnel, 1.4) * 0.95; 
            
            // Atmospheric pulse
            float pulse = sin(time * 1.5) * 0.1 + 0.9;

            // ---- Directional lighting (fixed star illumination) ----
            vec3 lightDir = normalize(vec3(-1.0, 0.15, 0.3));
            float diffuse = dot(vWorldNormal, lightDir);
            diffuse = smoothstep(-0.15, 0.6, diffuse);
            // ---- End lighting ----
            
            // Lit side vs dark side
            vec3 darkSide = vec3(0.02, 0.02, 0.025);
            vec3 litSide = vec3(0.13, 0.11, 0.10);
            vec3 coreColor = mix(darkSide, litSide, diffuse);

            // ---- Cloud band (upper hemisphere) ----
            // Object-space coords → rotates with the mesh
            vec3 cp = vPosition * 0.45;
            cp.y *= 3.0;  // horizontal stretching for band-like clouds
            float cloudNoise = snoise(cp) * 0.6 + snoise(cp * 2.5 + 4.0) * 0.3;
            
            // Soft mask: only in upper hemisphere
            float cloudMask = smoothstep(0.3, 1.8, vPosition.y);
            
            // Shape the cloud — gentle, organic edges
            float cloud = smoothstep(-0.1, 0.5, cloudNoise) * cloudMask;
            
            // Cloud gently darkens the surface, like a subtle gradient
            // On the shadow side, coreColor is already near-black → cloud is invisible
            coreColor *= 1.0 - cloud * 0.3;
            // ---- End upper cloud ----

            // ---- Cloud band (lower hemisphere) ----
            vec3 cp2 = vPosition * 0.5 + vec3(7.3, 2.1, 4.8); // offset for distinct shape
            cp2.y *= 2.5;
            float cloudNoise2 = snoise(cp2) * 0.6 + snoise(cp2 * 2.2 + 6.0) * 0.3;
            float cloudMask2 = smoothstep(-0.3, -1.6, vPosition.y); // lower hemisphere
            float cloud2 = smoothstep(-0.1, 0.5, cloudNoise2) * cloudMask2;
            coreColor *= 1.0 - cloud2 * 0.3;
            // ---- End lower cloud ----
            
            // Fuse the core with the high-exposure glowing rim
            vec3 finalColor = mix(coreColor, color, clamp(intensity * pulse, 0.0, 1.0));
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

const LunarBody = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Steady horizontal rotation — like a real planet spinning on its axis
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[3, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                attach="material"
                args={[EclipseShaderMaterial]}
                transparent={true}
            />
        </mesh>
    );
};

export default function EclipseMoon() {
    return (
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
            <LunarBody />
        </Canvas>
    );
}
