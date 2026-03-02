"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

function Model({ showOnly }: { showOnly: "mesh_0" | "mesh_1" | "both" }) {
  const { scene } = useGLTF("/model.glb", DRACO_URL);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "mesh_0") {
        child.visible = showOnly === "mesh_0" || showOnly === "both";
      }
      if (child.name === "mesh_1") {
        child.visible = showOnly === "mesh_1" || showOnly === "both";
      }
    });
  }, [scene, showOnly]);

  return <primitive object={scene} />;
}

// Preload the model so it starts fetching immediately
useGLTF.preload("/model.glb", DRACO_URL);

export default function ModelPage() {
  const [showOnly, setShowOnly] = useState<"mesh_0" | "mesh_1" | "both">("both");

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
      {/* Temporary toggle to identify which mesh is the figure */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "flex",
          gap: 8,
        }}
      >
        {(["mesh_0", "mesh_1", "both"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setShowOnly(opt)}
            style={{
              padding: "8px 16px",
              background: showOnly === opt ? "#fff" : "#333",
              color: showOnly === opt ? "#000" : "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "var(--font-bebas-neue), sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <Canvas camera={{ fov: 45 }} shadows>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} shadows>
            <Model showOnly={showOnly} />
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
