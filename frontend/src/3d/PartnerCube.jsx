import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Environment } from "@react-three/drei";
import { partners } from "../utils/partnersData";

const FACES = [
  { position: [0, 0, 1.01], rotation: [0, 0, 0] },
  { position: [0, 0, -1.01], rotation: [0, Math.PI, 0] },
  { position: [1.01, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [0, 1.01, 0], rotation: [-Math.PI / 2, 0, 0] },
  { position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0] },
];

const BATCH_SIZE = 6;
const CYCLE_MS = 2800;

function CubeFace({ face, partner, hovered, onHover, onUnhover, onClick }) {
  if (!partner) return null;

  return (
    <group position={face.position} rotation={face.rotation}>
      {/* invisible larger plane widens the hit area beyond the text glyphs */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onUnhover();
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(partner.url);
        }}
      >
        <planeGeometry args={[1.9, 1.9]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Text
        fontSize={hovered ? 0.19 : 0.16}
        maxWidth={1.4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color={hovered ? "#0f766e" : "#0a1612"}
      >
        {partner.name}
      </Text>
    </group>
  );
}

function Cube({ batchIndex }) {
  const group = useRef();
  const [hoveredFace, setHoveredFace] = useState(null);
  const isHovering = hoveredFace !== null;

  const batches = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < partners.length; i += BATCH_SIZE) {
      chunks.push(partners.slice(i, i + BATCH_SIZE));
    }
    return chunks;
  }, []);

  const current = batches[batchIndex % batches.length];

  useFrame((state, delta) => {
    // Pause the spin while a face is being hovered so it's easy to click.
    if (!isHovering) {
      group.current.rotation.y += delta * 0.35;
    }
    group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
  });

  const openPartner = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <group ref={group}>
      <RoundedBox args={[2, 2, 2]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#e4c766" roughness={0.35} metalness={0.15} />
      </RoundedBox>
      {FACES.map((face, i) => (
        <CubeFace
          key={i}
          face={face}
          partner={current[i]}
          hovered={hoveredFace === i}
          onHover={() => setHoveredFace(i)}
          onUnhover={() => setHoveredFace((h) => (h === i ? null : h))}
          onClick={openPartner}
        />
      ))}
    </group>
  );
}

export default function PartnerCube({ onBatchChange }) {
  const [batchIndex, setBatchIndex] = useState(0);
  const batchCount = Math.ceil(partners.length / BATCH_SIZE);

  useEffect(() => {
    const id = setInterval(() => {
      setBatchIndex((i) => {
        const next = (i + 1) % batchCount;
        onBatchChange?.(next);
        return next;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [batchCount, onBatchChange]);

  return (
    <Canvas camera={{ position: [3.4, 2.2, 3.4], fov: 40 }} dpr={[1, 1.8]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.3} color="#fff3d6" />
      <pointLight position={[-3, -1, -2]} intensity={1} color="#2dd4bf" />
      <Cube batchIndex={batchIndex} />
      <Environment preset="studio" />
    </Canvas>
  );
}
