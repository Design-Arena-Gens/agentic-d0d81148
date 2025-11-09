"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function createTowerGeometry() {
  const profile: THREE.Vector2[] = [];

  for (let i = 0; i <= 36; i += 1) {
    const t = i / 36;
    const y = -12 + t * 24;
    const normalized = Math.abs(y) / 12;
    const curve =
      3.2 +
      Math.pow(1 - normalized, 1.8) * 4.8 +
      Math.sin(t * Math.PI) * 0.75 -
      normalized * 1.1;
    profile.push(new THREE.Vector2(curve, y));
  }

  const lathe = new THREE.LatheGeometry(profile, 256, 0, Math.PI);
  lathe.computeVertexNormals();
  return lathe;
}

export default function AzadiTower() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(createTowerGeometry, []);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: "#f3f4f7",
      metalness: 0.08,
      roughness: 0.28,
      envMapIntensity: 0.85,
      emissive: "#152134",
      emissiveIntensity: 0.08
    });

    mat.onBeforeCompile = (shader) => {
      shader.defines = shader.defines ?? {};
      shader.defines.USE_RIBBED_PATTERN = "";
      shader.uniforms.time = { value: 0 };
      shader.uniforms.tintA = { value: new THREE.Color("#d8dde8") };
      shader.uniforms.tintB = { value: new THREE.Color("#f6f7fb") };
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <fog_vertex>",
        `
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vLocalPos = position.xyz;
        #include <fog_vertex>
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        uniform vec3 tintA;
        uniform vec3 tintB;
        uniform float time;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        float elevation = smoothstep(-8.0, 12.0, vLocalPos.y);
        float rib = sin((vLocalPos.x + vLocalPos.z) * 3.4) * 0.5 + 0.5;
        float ribSharp = smoothstep(0.4, 0.95, rib);
        vec3 tint = mix(tintA, tintB, elevation);
        float subtlePulse = sin(time * 0.3 + elevation * 3.0) * 0.015;
        vec3 ribColor = tint + ribSharp * 0.08 + subtlePulse;
        diffuseColor.rgb = ribColor;
        `
      );

      (mat as any).userData.shader = shader;
    };

    return mat;
  }, []);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#8996ab",
        transparent: true,
        opacity: 0.28
      }),
    []
  );

  const edgeGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry, 0.18),
    [geometry]
  );

  useFrame(({ clock }) => {
    const shader = (material as any)?.userData?.shader as
      | { uniforms: { time: { value: number } } }
      | undefined;
    if (shader) {
      shader.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.03) * 0.02;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
      <lineSegments geometry={edgeGeometry} material={lineMaterial} />

      <mesh position={[0, -7.9, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[16, 18, 3, 64, 1, true]} />
        <meshStandardMaterial
          color="#192234"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, -6.5, 0]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[8.2, 9.4, 2, 6, 1, true]} />
        <meshStandardMaterial
          color="#1e2a3e"
          roughness={0.7}
          metalness={0.18}
        />
      </mesh>

      <group position={[0, -1.9, 0]}>
        <mesh rotation={[0, 0, 0]} position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[7.2, 1.1, 7.2]} />
          <meshStandardMaterial
            color="#b9c4d4"
            roughness={0.48}
            metalness={0.12}
          />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[5.2, 0.35, 5.2]} />
          <meshPhysicalMaterial
            color="#cdd6e2"
            transmission={0.12}
            roughness={0.24}
            thickness={0.4}
            reflectivity={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}
