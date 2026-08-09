import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, Float } from "@react-three/drei";
import { partners } from "../utils/partnersData";

const COORDS = [-1, 0, 1];
const FACE_DEFS = [
  { axis: "x", dir: 1, position: [0.51, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { axis: "x", dir: -1, position: [-0.51, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { axis: "y", dir: 1, position: [0, 0.51, 0], rotation: [-Math.PI / 2, 0, 0] },
  { axis: "y", dir: -1, position: [0, -0.51, 0], rotation: [Math.PI / 2, 0, 0] },
  { axis: "z", dir: 1, position: [0, 0, 0.51], rotation: [0, 0, 0] },
  { axis: "z", dir: -1, position: [0, 0, -0.51], rotation: [0, Math.PI, 0] },
];

/* Build the 26 outer cubies (skip the hidden centre) and, for each,
   the list of faces that actually sit on the cube's outer shell. */
function buildCubies() {
  const cubies = [];
  let stickerCursor = 0;

  for (const x of COORDS) {
    for (const y of COORDS) {
      for (const z of COORDS) {
        if (x === 0 && y === 0 && z === 0) continue;

        const faces = FACE_DEFS.filter((f) => {
          const coord = { x, y, z }[f.axis];
          return coord === f.dir;
        }).map((f) => {
          const partner = partners[stickerCursor % partners.length];
          stickerCursor += 1;
          return { ...f, partner };
        });

        cubies.push({ x, y, z, faces });
      }
    }
  }
  return cubies;
}

function Sticker({ face, hovered, onHover, onUnhover, onClick }) {
  return (
    <group position={face.position} rotation={face.rotation}>
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
          onClick(face.partner.url);
        }}
      >
        <planeGeometry args={[0.86, 0.86]} />
        <meshStandardMaterial
          color={hovered ? "#2dd4c8" : "#ffffff"}
          emissive={hovered ? "#0e9488" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={hovered ? 0.115 : 0.1}
        maxWidth={0.75}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#10142e"
        sdfGlyphSize={24}
      >
        {face.partner.name}
      </Text>
    </group>
  );
}

function Cubie({ cubie }) {
  const [hoveredFace, setHoveredFace] = useState(null);
  const openPartner = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <group position={[cubie.x * 1.06, cubie.y * 1.06, cubie.z * 1.06]}>
      <RoundedBox args={[1, 1, 1]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#131a3d" roughness={0.5} metalness={0.1} />
      </RoundedBox>
      {cubie.faces.map((face, i) => (
        <Sticker
          key={i}
          face={face}
          hovered={hoveredFace === i}
          onHover={() => setHoveredFace(i)}
          onUnhover={() => setHoveredFace((h) => (h === i ? null : h))}
          onClick={openPartner}
        />
      ))}
    </group>
  );
}

/* Three horizontal layers, alternating spin direction — top and bottom
   share a direction, the middle layer spins the opposite way, echoing
   a Rubik's cube layer-turn without full multi-axis face-turn state. */
function Layer({ cubies, direction, speed }) {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * speed * direction;
  });
  return (
    <group ref={ref}>
      {cubies.map((c, i) => (
        <Cubie key={i} cubie={c} />
      ))}
    </group>
  );
}

function RubikCube() {
  const cubies = useMemo(buildCubies, []);
  const byLayer = useMemo(
    () => ({
      top: cubies.filter((c) => c.y === 1),
      mid: cubies.filter((c) => c.y === 0),
      bottom: cubies.filter((c) => c.y === -1),
    }),
    [cubies]
  );

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
      <group rotation={[0.35, 0.6, 0]}>
        <Layer cubies={byLayer.top} direction={1} speed={0.22} />
        <Layer cubies={byLayer.mid} direction={-1} speed={0.16} />
        <Layer cubies={byLayer.bottom} direction={1} speed={0.22} />
      </group>
    </Float>
  );
}

function ContextGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e) => {
      e.preventDefault();
      console.warn("Partner cube WebGL context lost — will attempt to restore.");
    };
    const onRestored = () => console.info("Partner cube WebGL context restored.");
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl]);
  return null;
}

export default function PartnerCube() {
  return (
    <Canvas
      camera={{ position: [4.6, 3.4, 4.6], fov: 38 }}
      dpr={[1, 1]}
      gl={{ antialias: false, powerPreference: "default" }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 2]} intensity={1.3} color="#dfe6ff" />
      <pointLight position={[-4, -1, -3]} intensity={1.8} color="#7c5cff" />
      <pointLight position={[4, 1, 3]} intensity={1.6} color="#2dd4c8" />
      <RubikCube />
      <ContextGuard />
    </Canvas>
  );
}
