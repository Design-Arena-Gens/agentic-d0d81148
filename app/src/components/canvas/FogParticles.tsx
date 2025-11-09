"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2800;

export default function FogParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const posArray = new Float32Array(PARTICLE_COUNT * 3);
    const speedArray = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.randFloat(12, 170);
      const height = THREE.MathUtils.randFloat(2, 30);
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = height - 8;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
      speedArray[i] = THREE.MathUtils.randFloat(0.02, 0.08);
    }

    return { positions: posArray, speeds: speedArray };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttr = geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const y = positionsAttr.getY(i);
      positionsAttr.setY(i, y + speeds[i] * delta * 18);
      if (y > 42) {
        const angle = Math.random() * Math.PI * 2;
        const radius = THREE.MathUtils.randFloat(14, 170);
        positionsAttr.setX(i, Math.cos(angle) * radius);
        positionsAttr.setZ(i, Math.sin(angle) * radius);
        positionsAttr.setY(i, -6 - Math.random() * 6);
      }
    }
    positionsAttr.needsUpdate = true;
  });

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#8895ab",
        size: 2.8,
        transparent: true,
        opacity: 0.065,
        sizeAttenuation: true,
        depthWrite: false
      }),
    []
  );

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}
