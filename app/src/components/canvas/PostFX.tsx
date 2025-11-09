"use client";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, ToneMappingMode } from "postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

export default function PostFX() {
  const chromaticOffset = useMemo(
    () => new THREE.Vector2(0.0009, 0.0007),
    []
  );
  return (
    <EffectComposer multisampling={0}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.42}
        mipmapBlur
        kernelSize={KernelSize.LARGE}
      />
      <ChromaticAberration
        offset={chromaticOffset}
        blendFunction={BlendFunction.NORMAL}
        radialModulation
        modulationOffset={0.2}
      />
      <Noise premultiply opacity={0.08} />
      <Vignette eskil={false} offset={0.42} darkness={0.8} />
    </EffectComposer>
  );
}
