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
      colors.set(index % 2 ? [.45, .28, 1] : [.03, .9, 1], index * 3);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  return <points geometry={geometry}><shaderMaterial transparent depthWrite={false} vertexColors blending={THREE.AdditiveBlending} vertexShader={`attribute vec3 color; varying vec3 vColor; void main(){ vColor=color; vec4 view=modelViewMatrix*vec4(position,1.0); gl_PointSize=5.0*(250.0/-view.z); gl_Position=projectionMatrix*view; }`} fragmentShader={`varying vec3 vColor; void main(){ float distance=length(gl_PointCoord-0.5); float glow=smoothstep(0.5,0.0,distance); gl_FragColor=vec4(vColor,glow*glow); }`}/></points>;
}
