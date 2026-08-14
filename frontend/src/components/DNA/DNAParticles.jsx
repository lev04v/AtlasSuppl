import * as THREE from "three";
import { useMemo } from "react";
import { particlePosition } from "./DNAHelix";

export default function DNAParticles() {
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 6000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const [x, y, z] = particlePosition(index, count);
      positions.set([x, y, z], index * 3);
      colors.set(index % 2 ? [.42, .53, .92] : [.65, .84, .96], index * 3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        vertexColors
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
