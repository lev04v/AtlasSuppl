import { useEffect, useRef, useState } from "react";
import "./ScrollVideoHero.css";
import desktopVideo from "./atlas-hero-desktop.mp4";
import mobileVideo from "./atlas-hero-mobile.mp4";

/**
 * Porsche-style pinned hero, scrubbed frame-by-frame from scroll progress.
 * Same choreography on mobile as on desktop — it just loads a lighter,
 * lower-resolution encode and seeks less aggressively so phone decoders
 * keep up.
 */
export default function ScrollVideoHero({
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

  // Pick the encode after hydration so SSR markup stays stable.
  const [src, setSrc] = useState(desktopVideo);
  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    setSrc(small ? mobileVideo : desktopVideo);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.play?.().catch(() => {});
      return;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const SEEK_EPS = isCoarsePointer ? 0.04 : 0.015;
    const LERP = isCoarsePointer ? 0.2 : 0.12;
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
    if (video.readyState >= 1) videoReady = true;

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
        running = false;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) {
          measure();
          startLoop();
        } else {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);

    measure();
    applyFrame(current);
    if (visible) startLoop();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [src]);

  return (
    <section ref={sectionRef} className="ashero">
      <div className="ashero__pin">
        <video
          key={src}
          ref={videoRef}
          className="ashero__video"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
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
