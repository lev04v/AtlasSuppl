import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function DNAInteraction({ target }) {
  useFrame(({ pointer, clock }, delta) => {
    const rig = target.current;
    if (!rig) return;

    const time = clock.getElapsedTime();
    rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, -0.1 + pointer.x * 0.45, 0.04);
    rig.rotation.y = THREE.MathUtils.lerp(rig.rotation.y, -0.4 + pointer.x * 0.7, 0.04);
    rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, 0.25 + pointer.y * 0.3, 0.04);
    rig.position.x = THREE.MathUtils.lerp(rig.position.x, pointer.x * 0.6, 0.04);
    rig.position.y = THREE.MathUtils.lerp(rig.position.y, pointer.y * 0.25, 0.05);
    rig.rotation.z += Math.sin(time * 0.8) * delta * 0.4;
  });

  return null;
}
