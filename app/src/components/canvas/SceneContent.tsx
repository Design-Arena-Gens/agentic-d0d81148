"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import Atmosphere from "./Atmosphere";
import AzadiTower from "./AzadiTower";
import Cityscape from "./Cityscape";
import CloudStrata from "./CloudStrata";
import FogParticles from "./FogParticles";
import Ground from "./Ground";
import Lights from "./Lights";
import SkyGradient from "./SkyGradient";

export default function SceneContent() {
  return (
    <>
      <Lights />
      <SkyGradient />
      <Environment preset="sunset" />
      <AzadiTower />
      <Ground />
      <Cityscape />
      <CloudStrata />
      <FogParticles />
      <Atmosphere />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={24}
        maxDistance={86}
        minPolarAngle={Math.PI / 4.2}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 8, 0]}
      />
    </>
  );
}
