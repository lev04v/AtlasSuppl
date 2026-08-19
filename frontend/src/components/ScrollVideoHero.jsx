import { useEffect, useRef } from "react";
import "./ScrollVideoHero.css";

/**
 * Porsche-style pinned hero.
 * The section is tall, the visual is sticky, and the video is scrubbed
 * frame-by-frame from scroll progress. When the video finishes, the page
 * releases into the next section.
 *
 * Perf notes (why this version is written the way it is):
 * - No React state is touched during scroll/animation. Every frame writes
 *   directly to DOM refs, so scrolling never triggers a React re-render.
 * - The rAF loop is gated by an IntersectionObserver: it only runs while
 *   the hero is near the viewport, and stops itself once it settles
 *   (instead of running forever at 60fps in the background).
 * - video.currentTime seeks are throttled with a bigger epsilon on
 *   touch/coarse-pointer devices, since mobile video decoders are much
 *   slower to seek than desktop and over-seeking is the #1 source of
 *   mobile scroll jank with this pattern.
 * - prefers-reduced-motion skips scroll-scrubbing entirely and just lets
 *   the video play normally.
 *
 * Usage:
 *   import ScrollVideoHero from "./components/ScrollVideoHero";
 *   <ScrollVideoHero src="/assets/atlas-hero-scrub.mp4" />
 */
export default function ScrollVideoHero({
  src = "/assets/atlas-hero-scrub.mp4",
  eyebrow = "B2B Medical Trade & Distribution",
  onExplore,
  onEnquiry,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const copyRef = useRef(null);
  const outroRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      // No scrubbing, no rAF loop at all — just let the video play.
      video.play?.().catch(() => {});
      return;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    // Mobile decoders are slow to seek — use a looser threshold so we
    // seek less often, and a snappier lerp so the loop settles (and can
    // stop) faster instead of chasing target for many extra frames.
    const SEEK_EPS = isCoarsePointer ? 0.05 : 0.015;
    const LERP = isCoarsePointer ? 0.18 : 0.12;
    const IDLE_EPS = 0.0006;

    const target = { p: 0 };
    let current = 0;
    let rafId = 0;
    let running = false;
    let visible = true;
    let videoReady = false;

    const onLoadedMetadata = () => {
      videoReady = true;
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    const applyFrame = (p) => {
      const titleOut = Math.min(1, p / 0.32);
      const outroIn = Math.min(1, Math.max(0, (p - 0.68) / 0.32));

      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - titleOut);
        copyRef.current.style.transform = `translateY(${titleOut * -60}px)`;
      }
      if (outroRef.current) {
        outroRef.current.style.opacity = String(outroIn);
        outroRef.current.style.transform = `translateY(${(1 - outroIn) * 40}px)`;
      }
      if (countRef.current) {
        countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.width = `${p * 100}%`;
      }
      if (videoReady && video.duration) {
        const t = p * video.duration;
        if (Math.abs(video.currentTime - t) > SEEK_EPS) {
          video.currentTime = t;
        }
      }
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      target.p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const tick = () => {
      current += (target.p - current) * LERP;

      if (Math.abs(target.p - current) < IDLE_EPS) {
        current = target.p;
        applyFrame(current);
        running = false; // settled — stop looping until scroll moves again
        return;
      }

      applyFrame(current);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running || !visible) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      startLoop();
    };

    // Only animate while the hero is actually near the viewport — once
    // it's scrolled well past, stop touching the video/DOM entirely.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          startLoop();
        } else {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(section);

    // Initial paint, before any scroll happens.
    measure();
    applyFrame(current);
    if (visible) startLoop();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ashero">
      <div className="ashero__pin">
        <video
          ref={videoRef}
          className="ashero__video"
          muted
          playsInline
          preload="auto"
          aria-label="Atlas Supply molecular supply chain visual"
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="ashero__veil" />

        <div className="ashero__inner">
          <div className="ashero__copy" ref={copyRef}>
            <p className="ashero__eyebrow">{eyebrow}</p>
            <h1 className="ashero__title">
              Medical supply,
              <br />
              <em>made clear.</em>
            </h1>
            <p className="ashero__lead">
              Atlas Supply connects manufacturer-sourced medical products with the
              wholesalers, distributors and institutional buyers who need them.
            </p>
            <div className="ashero__actions">
              <button type="button" className="ashero__btn" onClick={onExplore}>
                Explore products <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="ashero__link" onClick={onEnquiry}>
                Start a business enquiry
              </button>
            </div>
          </div>

          <div className="ashero__outro" ref={outroRef}>
            <h2 className="ashero__outroTitle">
              Then it becomes
              <br />
              <em>product.</em>
            </h2>
          </div>
        </div>

        <div className="ashero__progress">
          <span className="ashero__count" ref={countRef}>
            000
          </span>
          <div className="ashero__track">
            <div className="ashero__bar" ref={barRef} />
          </div>
          <span className="ashero__count">SCROLL</span>
        </div>
      </div>
    </section>
  );
}
