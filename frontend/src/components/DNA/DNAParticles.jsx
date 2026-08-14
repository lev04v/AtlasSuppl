import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createDNAClusters, smokePosition } from "./DNAHelix";

// Thin, pale swirling wisps around the helix, tuned to stay visible against a
// white background (saturated/additive smoke just disappears into white).
export default function DNAParticles({ smokeTarget }) {
  const emitters = useMemo(() => createDNAClusters().emitters, []);

  const smokeGeometry = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const [x, y, z] = smokePosition(index, count);
      const seed = ((index * 48271) % 2147483647) / 2147483647;
      positions.set([x, y, z], index * 3);
      const tint = 0.75 + seed * 0.2;
      colors.set([tint, tint + (1 - tint) * 0.45, 1], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  const wispCurves = useMemo(() => emitters.map((emitter, index) => {
    const origin = new THREE.Vector3(...emitter.position);
    const direction = new THREE.Vector3(...emitter.tangent);
    return new THREE.CatmullRomCurve3(Array.from({ length: 8 }, (_, pointIndex) => {
      const t = pointIndex / 7;
      const curl = Math.sin(t * Math.PI * 2 + index) * (0.1 + t * 0.3);
      return new THREE.Vector3(origin.x + direction.x * t * 1.1 + curl, origin.y + direction.y * t * 1.1 + t * 0.3, origin.z + direction.z * t * 1.1 + Math.cos(t * 5 + index) * 0.1);
    }));
  }), [emitters]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const motion = smokeTarget.current?.userData.motion || 0;
    if (smokeTarget.current) {
      smokeTarget.current.rotation.y += delta * (0.035 + motion * 0.14);
      smokeTarget.current.rotation.x = Math.sin(time * 0.22) * 0.04 + motion * 0.06;
      smokeTarget.current.scale.x = THREE.MathUtils.lerp(smokeTarget.current.scale.x, 1 + motion * 0.2, 0.04);
      smokeTarget.current.scale.y = THREE.MathUtils.lerp(smokeTarget.current.scale.y, 1 + Math.sin(time * 0.35) * 0.06, 0.04);
    }
  });

  return (
    <group ref={smokeTarget} position={[0, 0, 0]}>
      <points geometry={smokeGeometry}>
        <pointsMaterial size={0.16} sizeAttenuation transparent opacity={0.22} depthWrite={false} vertexColors blending={THREE.NormalBlending} />
      </points>
      {wispCurves.map((curve, index) => (
        <mesh key={`emitter-wisp-${index}`} rotation={[0, index * 0.04, index * 0.02]}>
          <tubeGeometry args={[curve, 40, 0.055 + (index % 3) * 0.02, 7, false]} />
          <meshBasicMaterial color="#dbe9fb" transparent opacity={0.16} depthWrite={false} blending={THREE.NormalBlending} />
        </mesh>
      ))}
    </group>
  );
}
