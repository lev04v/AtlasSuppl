import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const DEFAULT_CAMERA = [0, 0, 16.5]; // Pulled back slightly for a better framing
const DEFAULT_ROTATION = [0.08, -0.25, 0];

export default function DNAInteraction({ target, smokeTarget }) {
  const { gl, camera } = useThree();
  const state = useRef({ mode: null, lastX: 0, lastY: 0, pointerX: 0, pointerY: 0, speed: 0, spinX: 0, spinY: 0 });
  
  useEffect(() => {
    const element = gl.domElement;
    const current = state.current;
    
    const reset = () => {
      target.current?.rotation.set(...DEFAULT_ROTATION);
      target.current?.position.set(0, 0, 0); // Centered properly
      camera.position.set(...DEFAULT_CAMERA);
      camera.lookAt(0, 0, 0);
      current.spinX = 0;
      current.spinY = 0;
    };
    
    const onDown = (event) => {
      current.mode = event.button === 0 ? "rotate" : "pan";
      current.lastX = event.clientX;
      current.lastY = event.clientY;
      element.setPointerCapture?.(event.pointerId);
      if (event.button !== 0) event.preventDefault();
    };
    
    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      current.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      current.pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      
      const dx = event.clientX - current.lastX;
      const dy = event.clientY - current.lastY;
      
      // Calculate swipe speed for momentum
      current.speed = Math.min(1.5, current.speed * 0.85 + Math.hypot(dx, dy) * 0.02);
      
      if (!current.mode) return;
      
      if (current.mode === "rotate" && target.current) {
        target.current.rotation.y += dx * 0.006;
        target.current.rotation.x = THREE.MathUtils.clamp(
          target.current.rotation.x + dy * 0.005, 
          -Math.PI * 0.45, 
          Math.PI * 0.45
        );
        // Add momentum
        current.spinY = dx * 0.0006;
        current.spinX = dy * 0.0004;
      } else if (current.mode === "pan") {
        camera.position.x = THREE.MathUtils.clamp(camera.position.x + dx * 0.015, -6, 6);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y - dy * 0.015, -6, 6);
      }
      current.lastX = event.clientX;
      current.lastY = event.clientY;
    };
    
    const onUp = (event) => {
      current.mode = null;
      element.releasePointerCapture?.(event.pointerId);
    };
    
    const onWheel = (event) => {
      event.preventDefault();
      // Smooth zoom
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.01, 8, 25);
    };
    
    const onDoubleClick = (event) => { event.preventDefault(); reset(); };
    const onKey = (event) => { if (event.key.toLowerCase() === "r") reset(); };
    
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("dblclick", onDoubleClick);
    element.addEventListener("contextmenu", (event) => event.preventDefault());
    window.addEventListener("keydown", onKey);
    
    reset();
    
    return () => {
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [camera, gl, target]);

  useFrame(({ clock }, delta) => {
    const current = state.current;
    const time = clock.getElapsedTime();
    
    current.speed = THREE.MathUtils.lerp(current.speed, 0, 0.03); // Friction
    
    if (target.current && !current.mode) {
      // Auto-rotation + lingering momentum
      target.current.rotation.y += (0.05 + current.spinY) * delta;
      
      // Gentle floating animation
      target.current.rotation.x = THREE.MathUtils.lerp(
        target.current.rotation.x, 
        DEFAULT_ROTATION[0] + Math.sin(time * 0.5) * 0.05 + current.spinX, 
        0.03
      );
      target.current.rotation.z = THREE.MathUtils.lerp(
        target.current.rotation.z, 
        Math.sin(time * 0.3) * 0.03, 
        0.03
      );
      target.current.position.y = Math.sin(time * 0.4) * 0.1;
      
      // Dampen momentum
      current.spinX *= 0.92;
      current.spinY *= 0.92;
    }
    
    // Parallax effect for the smoke
    if (smokeTarget.current) {
      smokeTarget.current.position.x = THREE.MathUtils.lerp(
        smokeTarget.current.position.x, 
        current.pointerX * 0.8, 
        0.04
      );
      smokeTarget.current.position.y = THREE.MathUtils.lerp(
        smokeTarget.current.position.y, 
        current.pointerY * 0.6, 
        0.04
      );
      smokeTarget.current.userData.motion = THREE.MathUtils.lerp(
        smokeTarget.current.userData.motion || 0, 
        current.speed, 
        0.05
      );
    }
  });
  
  return null;
}