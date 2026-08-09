import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { scrollProgress } from "../utils/scrollProgress";

/* ---- DNA double helix: two instanced strands + connecting rungs ---- */
function DNAHelix() {
  const group = useRef();

  const { strandA, strandB, rungs } = useMemo(() => {
    const turns = 5;
    const pointsPerTurn = 14;
    const total = turns * pointsPerTurn;
    const radius = 1.1;
    const height = 6.5;

    const a = [];
    const b = [];
    const r = [];

    for (let i = 0; i < total; i++) {
      const theta = (i / pointsPerTurn) * Math.PI * 2;
      const y = -height / 2 + (i / total) * height;
      const pa = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
      const pb = new THREE.Vector3(
        Math.cos(theta + Math.PI) * radius,
        y,
        Math.sin(theta + Math.PI) * radius
      );
      a.push(pa);
      b.push(pb);
      if (i % 2 === 0) r.push([pa, pb]);
    }
    return { strandA: a, strandB: b, rungs: r };
  }, []);

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      <Instances limit={strandA.length} range={strandA.length}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#2dd4c8" emissive="#0e9488" emissiveIntensity={0.6} roughness={0.3} />
        {strandA.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      <Instances limit={strandB.length} range={strandB.length}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#a78bfa" emissive="#4c34b8" emissiveIntensity={0.6} roughness={0.3} />
        {strandB.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {rungs.map(([pa, pb], i) => (
        <Rung key={i} from={pa} to={pb} />
      ))}
    </group>
  );
}

function Rung({ from, to }) {
  const { position, rotation, length } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const dir = to.clone().sub(from);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { position: mid, rotation: new THREE.Euler().setFromQuaternion(quat), length: len };
  }, [from, to]);

  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.018, 0.018, length, 6]} />
      <meshStandardMaterial color="#f3f5ff" transparent opacity={0.55} roughness={0.5} />
    </mesh>
  );
}

/* A couple of subtle capsules kept off to the side — pharma texture,
   without competing with the DNA centerpiece. */
function Capsule({ position, rotation, scale = 1 }) {
  const group = useRef();
  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.15;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.9}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2f5dff" roughness={0.2} metalness={0.2} transparent opacity={0.85} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1, 24, 1, true]} />
          <meshStandardMaterial color="#f3f5ff" roughness={0.1} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f3f5ff" roughness={0.1} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current;

    state.camera.position.x = Math.sin(t * 0.08) * 0.5;
    state.camera.position.y = 0.2 + Math.cos(t * 0.06) * 0.2 - p * 0.5;
    state.camera.position.z = 7.5 - p * 3;
    state.camera.fov = 40 + p * 6;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(0, -p * 0.3, 0);
  });
  return null;
}

function ContextGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e) => {
      e.preventDefault();
      console.warn("Hero WebGL context lost — will attempt to restore.");
    };
    const onRestored = () => console.info("Hero WebGL context restored.");
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl]);
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1]}
      camera={{ position: [0, 0.2, 7.5], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "default" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color="#dfe6ff" />
      <pointLight position={[-3, -2, -2]} intensity={1.6} color="#7c5cff" />
      <pointLight position={[3, 2, 2]} intensity={1.4} color="#2dd4c8" />

      <DNAHelix />
      <Capsule position={[-2.6, 1.1, -1.5]} rotation={[0.3, 0.6, 0.9]} scale={0.7} />
      <Capsule position={[2.7, -1.2, -1.8]} rotation={[0.9, 0.2, 0.4]} scale={0.55} />

      <Sparkles count={35} scale={[9, 6, 5]} size={2} speed={0.2} color="#a78bfa" opacity={0.45} />

      <Rig />
      <ContextGuard />
    </Canvas>
  );
}
