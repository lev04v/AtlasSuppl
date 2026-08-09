/* A single mutable object shared between the DOM (GSAP ScrollTrigger)
   and the R3F render loop (useFrame), so scroll updates don't trigger
   React re-renders — the 3D scene just reads the latest value each frame. */
export const scrollProgress = { current: 0 };
