"use client";

import { Float } from "@react-three/drei";

export function Orbs() {
    return (
        <group position={[0, 0, -5]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={2}>
                <mesh position={[-2, 1, 0]}>
                    <sphereGeometry args={[1.8, 32, 32]} />
                    <meshBasicMaterial color="#4a90e2" transparent opacity={0.6} />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={2}>
                <mesh position={[2.5, -1.5, -1]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshBasicMaterial color="#9013fe" transparent opacity={0.6} />
                </mesh>
            </Float>
            <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.5}>
                <mesh position={[0, 2.5, -2]}>
                    <sphereGeometry args={[1.2, 32, 32]} />
                    <meshBasicMaterial color="#50e3c2" transparent opacity={0.5} />
                </mesh>
            </Float>
        </group>
    );
}
