"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Lights() {
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.SpotLight>(null);

  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (keyLight.current) {
      keyLight.current.intensity = 1.2 + Math.sin(t * 0.25) * 0.05;
      keyLight.current.color.setHSL(0.58, 0.22, 0.92);
    }
    if (rimLight.current) {
      rimLight.current.intensity = 1.1 + Math.sin(t * 0.6) * 0.08;
    }
  });

  return (
    <>
      <primitive object={target} position={[0, 18, 0]} />
      <ambientLight intensity={0.38} color="#5c6a82" />
      <directionalLight
        ref={keyLight}
        position={[-26, 32, 18]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        color="#f2f5ff"
        intensity={1.25}
        target={target}
      />
      <spotLight
        ref={rimLight}
        position={[18, 20, -20]}
        angle={0.6}
        penumbra={0.8}
        distance={120}
        intensity={0.9}
        color="#3a6bc7"
      />
      <rectAreaLight
        position={[0, 12, 60]}
        width={60}
        height={20}
        intensity={0.6}
        color="#0f1b30"
      />
    </>
  );
}
