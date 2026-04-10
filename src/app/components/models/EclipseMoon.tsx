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
        varying vec3 vLocalPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vLocalPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vLocalPosition;

        // --- 3D Value Noise --- //
        float hash(vec3 p) {
            p = fract(p * 0.3183099 + .1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                           mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                           mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
        }
        float fbm(vec3 p) {
            float f = 0.0;
            f += 0.5000 * noise(p); p *= 2.02;
            f += 0.2500 * noise(p); p *= 2.03;
            f += 0.1250 * noise(p); p *= 2.01;
            f += 0.0625 * noise(p);
            return f / 0.9375;
        }
        // ---------------------- //

        void main() {
            // View vector
            vec3 viewVector = vec3(0.0, 0.0, 1.0);
            float dotProduct = dot(vNormal, viewVector);

            // Fresnel equation (1.0 at absolute edges, 0.0 at dead center)
            float fresnel = max(0.0, 1.0 - dotProduct);

            // Power multiplier to thicken the glowing ring.
            float intensity = pow(fresnel, 1.1) * 1.0;

            // Lift the core color slightly so it feels like a heavy physical planet
            vec3 coreColor = vec3(0.03, 0.03, 0.035);

            // Fuse the core with the high-exposure glowing rim
            vec3 finalColor = mix(coreColor, color, clamp(intensity, 0.0, 1.0));

            // --- Southern hemisphere atmospheric swirl --- //
            // Stretched horizontally for band-like flow
            vec3 sp = vLocalPosition * 0.5;
            sp.y *= 3.5;
            float swirl = fbm(sp) * 0.7 + fbm(sp * 2.3 + vec3(3.7)) * 0.3;
            swirl = smoothstep(0.2, 0.65, swirl);

            // Mask: only visible in the southern hemisphere, soft falloff
            float southMask = smoothstep(-0.1, -1.2, vLocalPosition.y);

            // Face visibility: fades to zero at the dark rim/edges (respects shadow)
            float faceLight = pow(1.0 - fresnel, 1.5);

            // Composite: extremely faint white wisp
            finalColor += vec3(0.09) * swirl * southMask * faceLight;
            // --- End atmospheric swirl --- //

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
