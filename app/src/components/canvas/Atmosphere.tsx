"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function Atmosphere() {
  const lightConeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#6a8ccf",
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
    []
  );

  const hazeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#1b2a3e",
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
    []
  );

  return (
    <group>
      <mesh
        position={[-14, 16, -26]}
        rotation={[Math.PI / 2.5, 0.52, -0.12]}
      >
        <coneGeometry args={[18, 72, 32, 1, true]} />
        <primitive attach="material" object={lightConeMaterial} />
      </mesh>
      <mesh
        position={[0, -4.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[30, 160, 128]} />
        <primitive attach="material" object={hazeMaterial} />
      </mesh>
      <mesh
        position={[0, 40, 0]}
      >
        <sphereGeometry args={[120, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#203653"
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
