'use client'

import dynamic from 'next/dynamic'

// Dynamically import to prevent SSR issues with Three.js WebGL context
const BalloonCluster = dynamic(() => import('../components/models/BalloonCluster'), {
    ssr: false,
})

const Skills = () => {
    return (
        <div className="relative w-full" style={{ backgroundColor: '#111111' }}>
            {/* Balloon Cluster — full-width preview */}
            <div className="w-full h-[100dvh] flex items-center justify-center">
                <div className="w-full h-full max-w-2xl mx-auto">
                    <BalloonCluster />
                </div>
            </div>
        </div>
    )
}

export default Skills
