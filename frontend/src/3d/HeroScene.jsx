import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* A two-tone capsule built from a cylinder body + two sphere caps,
   avoiding CapsuleGeometry for broad three.js version compatibility. */
function Capsule({ position, rotation, scale = 1, colorA = "#c9a227", colorB = "#edefec" }) {
  const group = useRef();

  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.15;
    group.current.rotation.x += delta * 0.05;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={colorA} roughness={0.25} metalness={0.15} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 1, 32, 1, true]} />
          <meshStandardMaterial color={colorB} roughness={0.15} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={colorB} roughness={0.15} metalness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

/* A small molecule cluster: central atom + orbiting atoms connected by bonds. */
function Molecule({ position }) {
  const group = useRef();
  const nodes = useMemo(
    () => [
      [0.9, 0.3, 0],
      [-0.8, 0.5, 0.4],
      [0.2, -0.7, 0.6],
      [-0.3, -0.2, -0.8],
    ],
    []
  );

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={group} position={position}>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={0.4} roughness={0.3} />
        </mesh>
        {nodes.map((n, i) => (
          <group key={i}>
            <mesh position={n}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#e4c766" roughness={0.35} />
            </mesh>
            <Bond from={[0, 0, 0]} to={n} />
          </group>
        ))}
      </group>
    </Float>
  );
}

function Bond({ from, to }) {
  const ref = useRef();
  const { position, rotation, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return { position: mid, rotation: euler, length: len };
  }, [from, to]);

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial color="#93a29c" roughness={0.6} />
    </mesh>
  );
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.08) * 0.6;
    state.camera.position.y = 0.2 + Math.cos(t * 0.06) * 0.25;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.2, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} color="#fff3d6" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#2dd4bf" />

      <Capsule position={[1.8, 0.6, -0.5]} rotation={[0.3, 0.6, 0.9]} scale={1.1} />
      <Capsule
        position={[-2.1, -0.5, -1]}
        rotation={[0.9, 0.2, 0.4]}
        scale={0.85}
        colorA="#2dd4bf"
        colorB="#0a1612"
      />
      <Capsule position={[-1.1, 1.1, -1.6]} rotation={[0.2, 1.1, 0.2]} scale={0.6} />
      <Molecule position={[2.1, -1, -1.8]} />

      <Sparkles count={60} scale={[8, 5, 4]} size={2} speed={0.25} color="#e4c766" opacity={0.5} />

      <Rig />
      <Environment preset="city" />
    </Canvas>
  );
}
