import { Canvas } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import DNAParticles from "./DNAParticles.jsx";
import DNAInteraction from "./DNAInteraction";
import { strandPoint } from "./DNAHelix";
import "./DNA.css";

function Strand({ strand, color }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        Array.from({ length: 300 }, (_, index) => new THREE.Vector3(...strandPoint(index, strand)))
      ),
    [strand]
  );

  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 320, 0.082, 18, false]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        roughness={0.42}
        metalness={0.2}
        clearcoat={0.8}
        clearcoatRoughness={0.35}
      />
    </mesh>
  );
}

function Rungs() {
  const geometry = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 300; i += 8) {
      positions.push(...strandPoint(i, 0), ...strandPoint(i, 1));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#dffcff" transparent opacity={0.45} />
    </lineSegments>
  );
}

function Bubbles() {
  const bubbles = useMemo(() => {
    const items = [];
    for (let strand = 0; strand < 2; strand += 1) {
      for (let i = 0; i < 300; i += 8) {
        const [x, y, z] = strandPoint(i, strand);
        items.push({
          position: [x, y, z],
          color: strand === 0 ? "#27dce9" : "#9274ff",
          scale: 0.12 + ((i % 5) + 1) * 0.04,
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {bubbles.map((bubble, index) => (
        <mesh key={`${bubble.color}-${index}`} position={bubble.position} scale={bubble.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color={bubble.color}
            emissive={bubble.color}
            emissiveIntensity={0.18}
            transparent
            opacity={0.8}
            roughness={0.6}
            metalness={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const rig = useRef();

  return (
    <>
      <DNAInteraction target={rig} />
      <group ref={rig} rotation={[0.25, -0.42, -0.12]} position={[0, 0.15, 0]}>
        <Float speed={1.1} floatIntensity={0.4} rotationIntensity={0.2}>
          <Strand strand={0} color="#27dce9" />
          <Strand strand={1} color="#9274ff" />
          <Rungs />
          <Bubbles />
          <DNAParticles />
        </Float>
      </group>
      <Sparkles count={120} scale={[13, 7, 5]} size={2} speed={0.18} color="#75e8f5" />
    </>
  );
}

export default function DNA() {
  return (
    <div className="dna-canvas">
      <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={2} />
        <pointLight position={[3, 4, 3]} intensity={20} color="#5bf2e7" />
        <pointLight position={[-3, -2, 2]} intensity={18} color="#8d73ff" />
        <Scene />
      </Canvas>
    </div>
  );
}
