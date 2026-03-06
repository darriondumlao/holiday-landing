"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

const MODEL_URL = "/codxholiday.glb";

function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    console.log("=== MODEL SCENE HIERARCHY ===");
    scene.traverse((child) => {
      console.log(`[${child.type}] name="${child.name}" | visible=${child.visible}`);
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_URL);

export default function ModelPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background: "#000",
        position: "relative",
        touchAction: "none",
      }}
    >
      <Canvas camera={{ fov: 45 }} shadows>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} shadows>
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minDistance={1}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontFamily: "var(--font-bebas-neue), sans-serif",
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      >
        DRAG TO ROTATE · SCROLL TO ZOOM · SHIFT+DRAG TO PAN
      </div>
    </div>
  );
}
