import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const DEFAULT_CAMERA = [0, 0, 16.5];
const INTRO_START_Z_OFFSET = 9; // how much further back the camera starts before zooming in
const INTRO_DURATION = 1.6; // seconds
// x: slight face-on tilt, y: turns the helix a bit toward camera, z: unused (kept flat).
const DEFAULT_ROTATION = [0.08, -0.25, 0];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function DNAInteraction({ target, smokeTarget }) {
  const { gl, camera } = useThree();
  const state = useRef({ dragging: false, lastX: 0, pointerX: 0, pointerY: 0, spin: 0, introStart: null, introDone: false });

  useEffect(() => {
    const element = gl.domElement;
    const current = state.current;

    const reset = () => {
      target.current?.rotation.set(...DEFAULT_ROTATION);
      target.current?.position.set(0, 0, 0);
      // Start pulled back, then zoom in to the resting distance — the "reveal" on open/reset.
      camera.position.set(DEFAULT_CAMERA[0], DEFAULT_CAMERA[1], DEFAULT_CAMERA[2] + INTRO_START_Z_OFFSET);
      camera.lookAt(0, 0, 0);
      current.spin = 0;
      current.introStart = null;
      current.introDone = false;
    };

    const onDown = (event) => {
      current.dragging = true;
      current.lastX = event.clientX;
      element.setPointerCapture?.(event.pointerId);
    };

    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      current.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      current.pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      if (!current.dragging || !target.current) return;

      // Any drag direction spins the helix around its own axis — no pan, no free orbit.
      const dx = event.clientX - current.lastX;
      target.current.rotateX(dx * 0.008);
      current.spin = dx * 0.0006;
      current.lastX = event.clientX;
    };

    const onUp = (event) => {
      current.dragging = false;
      element.releasePointerCapture?.(event.pointerId);
    };

    const onWheel = (event) => {
      event.preventDefault();
      current.introDone = true; // cancel any in-progress intro so it doesn't fight manual zoom
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.01, 8, 25);
    };

    const onDoubleClick = (event) => { event.preventDefault(); reset(); };
    const onKey = (event) => { if (event.key.toLowerCase() === "r") reset(); };
    const onContextMenu = (event) => event.preventDefault();

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("dblclick", onDoubleClick);
    element.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKey);

    reset();

    return () => {
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("dblclick", onDoubleClick);
      element.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKey);
    };
  }, [camera, gl, target]);

  useFrame(({ clock }, delta) => {
    const current = state.current;
    const time = clock.getElapsedTime();

    // Zoom-in intro: pulled-back start eases down to the resting camera distance.
    if (!current.introDone) {
      if (current.introStart === null) current.introStart = time;
      const introElapsed = time - current.introStart;
      if (introElapsed < INTRO_DURATION) {
        const t = easeOutCubic(THREE.MathUtils.clamp(introElapsed / INTRO_DURATION, 0, 1));
        camera.position.z = THREE.MathUtils.lerp(DEFAULT_CAMERA[2] + INTRO_START_Z_OFFSET, DEFAULT_CAMERA[2], t);
      } else {
        current.introDone = true;
      }
    }

    current.spin = THREE.MathUtils.lerp(current.spin, 0, 0.03); // friction on drag momentum

    if (target.current && !current.dragging) {
      // Constant spin on its own axis, plus any leftover momentum from the last drag.
      target.current.rotateX((0.05 + current.spin) * delta);
    }

    if (smokeTarget?.current) {
      smokeTarget.current.position.x = THREE.MathUtils.lerp(smokeTarget.current.position.x, current.pointerX * 0.8, 0.04);
      smokeTarget.current.position.y = THREE.MathUtils.lerp(smokeTarget.current.position.y, current.pointerY * 0.6, 0.04);
    }
  });

  return null;
}
