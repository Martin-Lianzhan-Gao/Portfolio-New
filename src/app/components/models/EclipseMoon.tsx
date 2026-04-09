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
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        
        void main() {
            // View vector
            vec3 viewVector = vec3(0.0, 0.0, 1.0);
            float dotProduct = dot(vNormal, viewVector);
            
            // Fresnel equation (1.0 at absolute edges, 0.0 at dead center)
            float fresnel = max(0.0, 1.0 - dotProduct);
            
            // Power multiplier to thicken the glowing ring. 
            // The smaller the power, the thicker the rim.
            float intensity = pow(fresnel, 1.4) * 0.95; 
            
            // Atmospheric pulse
            float pulse = sin(time * 1.5) * 0.1 + 0.9;
            
            // Lift the core color slightly so it feels like a heavy physical planet, not empty transparent space
            vec3 coreColor = vec3(0.03, 0.03, 0.035); 
            
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
            // Slow elegant rotation
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
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
