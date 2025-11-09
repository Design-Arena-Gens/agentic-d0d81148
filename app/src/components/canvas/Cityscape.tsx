"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BUILDING_COUNT = 420;

export default function Cityscape() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorPalette = useMemo(
    () => [
      new THREE.Color("#1c2738"),
      new THREE.Color("#222f43"),
      new THREE.Color("#162030"),
      new THREE.Color("#1b283a")
    ],
    []
  );

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: "#1a2434",
      roughness: 0.62,
      metalness: 0.32,
      emissive: "#111b2b",
      emissiveIntensity: 0.45
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform float time;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        vec2 grid = vUv * vec2(40.0, 24.0);
        vec2 cell = fract(grid) - 0.5;
        float windowMask = step(abs(cell.x), 0.42) * step(abs(cell.y), 0.48);
        float flicker = 0.45 + 0.35 * sin(time * 0.4 + vUv.x * 12.0);
        float lightMask = windowMask * smoothstep(0.0, 0.6, sin(grid.x + grid.y + time * 0.7));
        totalEmissiveRadiance += vec3(0.9, 0.74, 0.56) * lightMask * flicker;
        `
      );

      (mat as any).userData.shader = shader;
    };

    return mat;
  }, []);

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }
    const radialBands = [56, 72, 96, 124, 150];
    for (let i = 0; i < BUILDING_COUNT; i += 1) {
      const radius = radialBands[i % radialBands.length] + Math.random() * 12;
      const angle = (i / BUILDING_COUNT) * Math.PI * 2 + Math.random() * 0.3;
      const height = THREE.MathUtils.randFloat(6, 32);
      const width = THREE.MathUtils.randFloat(2.2, 6);
      const depth = THREE.MathUtils.randFloat(2, 5.8);

      dummy.position.set(
        Math.cos(angle) * radius,
        height / 2 - 8,
        Math.sin(angle) * radius
      );
      dummy.scale.set(width, height, depth);
      dummy.rotation.y = angle + Math.PI;
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
      const color = colorPalette[i % colorPalette.length].clone();
      color.offsetHSL(0, 0, THREE.MathUtils.randFloat(-0.05, 0.08));
      if (meshRef.current.instanceColor) {
        meshRef.current.setColorAt(i, color);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [colorPalette, dummy]);

  useFrame(({ clock }) => {
    const shader = (material as any)?.userData?.shader as
      | { uniforms: { time: { value: number } } }
      | undefined;
    if (shader) {
      shader.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, BUILDING_COUNT]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
}
