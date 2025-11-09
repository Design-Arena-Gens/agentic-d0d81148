"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function SkyGradient() {
  const material = useMemo(() => {
    const shader = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color("#1b2d44") },
        bottomColor: { value: new THREE.Color("#0a101c") }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, 20.0, 0.0)).y;
          float gradient = smoothstep(-0.4, 0.6, h);
          vec3 color = mix(bottomColor, topColor, gradient);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    shader.uniformsNeedUpdate = true;
    return shader;
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[240, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
