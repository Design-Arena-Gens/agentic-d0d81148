"use client";

import { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import SceneContent from "./SceneContent";
import PostFX from "./PostFX";

type TehranSceneProps = {
  onCaptureReady?: (payload: SceneCapturePayload) => void;
};

export type SceneCapturePayload = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  size: { width: number; height: number };
  setSize: (
    width: number,
    height: number,
    updateStyle?: boolean,
    top?: number,
    left?: number
  ) => void;
  setDpr: (dpr: number) => void;
  invalidate: () => void;
};

function SceneBridge({
  onReady
}: {
  onReady?: (payload: SceneCapturePayload) => void;
}) {
  const { gl, scene, camera, size, setSize, setDpr, invalidate } = useThree();
  const invoked = useRef(false);

  if (!invoked.current && onReady) {
    onReady({
      renderer: gl,
      scene,
      camera: camera as PerspectiveCamera,
      size,
      setSize,
      setDpr,
      invalidate
    });
    invoked.current = true;
  }

  return null;
}

export default function TehranScene({ onCaptureReady }: TehranSceneProps) {
  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 14, 46], fov: 40, near: 0.1, far: 500 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0b1626");
        gl.toneMappingExposure = 1.28;
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0b1626"]} />
        <fog attach="fog" color="#0b1626" near={28} far={210} />
        <SceneContent />
        <SceneBridge onReady={onCaptureReady} />
        <PostFX />
      </Suspense>
    </Canvas>
  );
}
