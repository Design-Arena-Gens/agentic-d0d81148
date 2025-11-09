"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function Ground() {
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: "#0f1523",
      roughness: 0.92,
      metalness: 0.05
    });

    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        float fogGradient = smoothstep(0.0, 1.0, vUv.y);
        vec3 baseColor = mix(vec3(0.035, 0.06, 0.11), vec3(0.06, 0.12, 0.24), fogGradient);
        diffuseColor.rgb = baseColor;
        `
      );
    };

    return mat;
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.6, 0]}
      receiveShadow
    >
      <planeGeometry args={[500, 500, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
