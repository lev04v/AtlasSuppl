import { Canvas } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import DNAParticles from "./DNAParticles.jsx";
import DNAInteraction from "./DNAInteraction";
import { CLUSTER_BUBBLES, createDNAClusters } from "./DNAHelix";
import "./DNA.css";

// Deep blue base tones — the "shine" comes from the emissive glow color below,
// not from these being light themselves.
const BLUE = ["#081b4d", "#0c2568", "#123385", "#1a41a3", "#2450c0"];
const PURPLE = ["#ff8fe0", "#f95fd0", "#e13fc0"];
// Light blue emissive core — this is what reads as "glowing from inside".
const BLUE_GLOW = "#6ec3ff";
const PURPLE_GLOW = "#ffd6f6";

function BubbleInstances({ points, color, radius, seed = 0, glow = BLUE_GLOW, glowIntensity = 0.55 }) {
  const ref = useRef();
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        emissive: glow,
        emissiveIntensity: glowIntensity,
        roughness: 0.05,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        reflectivity: 1,
        transmission: 0.12,
        thickness: 0.5,
        ior: 1.4,
        envMapIntensity: 1.5,
      }),
    [color, glow, glowIntensity]
  );
  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new THREE.Matrix4();
    points.forEach((point, index) => {
      const size = radius * (0.75 + ((index * 17 + seed) % 12) * 0.05);
      matrix.compose(new THREE.Vector3(...point.position), new THREE.Quaternion(), new THREE.Vector3(size, size, size));
      ref.current.setMatrixAt(index, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [points, radius, seed]);
  return <instancedMesh ref={ref} args={[geometry, material, points.length]} castShadow receiveShadow />;
}

function ClusterDNA() {
  const dna = useMemo(() => createDNAClusters(), []);
  const ringBubbles = useMemo(() => dna.clusters.flatMap((strandClusters) => strandClusters.flatMap((cluster) => cluster.bubbles)), [dna]);
  const blueRingGroups = useMemo(() => BLUE.map((color, colorIndex) => ({ color, points: ringBubbles.filter((point) => point.bubbleIndex % BLUE.length === colorIndex && !(point.bubbleIndex === 0 && point.clusterIndex % 5 === 0)) })), [ringBubbles]);
  const purpleRingGroups = useMemo(() => PURPLE.map((color, colorIndex) => ({ color, points: ringBubbles.filter((point) => point.bubbleIndex === 0 && point.clusterIndex % 5 === 0 && point.clusterIndex % PURPLE.length === colorIndex) })), [ringBubbles]);
  const highlightPoints = useMemo(() => dna.clusters.flatMap((strandClusters, strand) => strandClusters.filter((_, index) => index % 5 === 0).map((cluster) => ({ position: cluster.center, strand }))), [dna]);
  const blueRungs = useMemo(() => dna.rungs.filter((point) => point.rungIndex % 4 !== 0), [dna]);
  const purpleRungs = useMemo(() => dna.rungs.filter((point) => point.rungIndex % 4 === 0), [dna]);
  const blueConnectors = useMemo(() => dna.connectors.filter((point) => point.strand === 0), [dna]);
  const purpleConnectors = useMemo(() => dna.connectors.filter((point) => point.strand === 1), [dna]);

  return (
    <group>
      {blueRingGroups.map((group, index) => <BubbleInstances key={`ring-blue-${index}`} points={group.points} color={group.color} radius={0.17} seed={index} glow={BLUE_GLOW} glowIntensity={0.55} />)}
      {purpleRingGroups.map((group, index) => <BubbleInstances key={`ring-purple-${index}`} points={group.points} color={group.color} radius={0.18} seed={index + 20} glow={PURPLE_GLOW} glowIntensity={0.45} />)}
      <BubbleInstances points={highlightPoints} color="#f95fd0" radius={0.24} seed={40} glow={PURPLE_GLOW} glowIntensity={0.5} />
      <BubbleInstances points={blueRungs} color="#123385" radius={0.035} seed={60} glow={BLUE_GLOW} glowIntensity={0.6} />
      <BubbleInstances points={purpleRungs} color="#ff8fe0" radius={0.04} seed={80} glow={PURPLE_GLOW} glowIntensity={0.5} />
      <BubbleInstances points={blueConnectors} color="#123385" radius={0.17} seed={100} glow={BLUE_GLOW} glowIntensity={0.55} />
      <BubbleInstances points={purpleConnectors} color="#f95fd0" radius={0.18} seed={120} glow={PURPLE_GLOW} glowIntensity={0.45} />
    </group>
  );
}

function Scene() {
  const rig = useRef();
  const smoke = useRef();
  return (
    <>
      <DNAInteraction target={rig} smokeTarget={smoke} />
      <group ref={rig} position={[0, 0, 0]}>
        <ClusterDNA />
      </group>
      <DNAParticles smokeTarget={smoke} />
      <Sparkles count={120} scale={[22, 8, 5]} size={1.1} speed={0.18} color="#9cd3ff" noise={1.5} />
    </>
  );
}

export default function DNA() {
  return (
    <div className="dna-canvas" aria-label={`Interactive molecular DNA model with ${CLUSTER_BUBBLES}-bubble clusters`}>
      <Canvas camera={{ position: [0, 0, 15.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.15} color="#ffffff" />
        <hemisphereLight intensity={1.1} color="#ffffff" groundColor="#c1d5ff" />
        <directionalLight position={[4, 5, 6]} intensity={5.5} color="#ffffff" />
        <pointLight position={[4, 0, 4]} intensity={10} color="#2450c0" />
        <pointLight position={[-4, 1, 2]} intensity={7} color="#f95fd0" />
        <Environment preset="studio" background={false} />
        <Scene />
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
