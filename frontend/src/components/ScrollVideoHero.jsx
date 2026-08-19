import { useEffect, useRef, useState } from "react";
import "./ScrollVideoHero.css";

/**
 * Porsche-style pinned hero.
 * The section is tall, the visual is sticky, and the video is scrubbed
 * frame-by-frame from scroll progress. When the video finishes, the page
 * releases into the next section.
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = { p: 0 };
    let current = 0;
    let raf = 0;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      target.p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const tick = () => {
      current += (target.p - current) * 0.12;
      const video = videoRef.current;
      if (video && video.duration) {
        const t = current * video.duration;
        if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      }
      setProgress(current);
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const titleOut = Math.min(1, progress / 0.32);
  const outroIn = Math.min(1, Math.max(0, (progress - 0.68) / 0.32));

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
          <div
            className="ashero__copy"
            style={{
              opacity: 1 - titleOut,
              transform: `translateY(${titleOut * -60}px)`,
            }}
          >
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

          <div
            className="ashero__outro"
            style={{
              opacity: outroIn,
              transform: `translateY(${(1 - outroIn) * 40}px)`,
            }}
          >
            <h2 className="ashero__outroTitle">
              Then it becomes
              <br />
              <em>product.</em>
            </h2>
          </div>
        </div>

        <div className="ashero__progress">
          <span className="ashero__count">
            {String(Math.round(progress * 100)).padStart(3, "0")}
          </span>
          <div className="ashero__track">
            <div className="ashero__bar" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="ashero__count">SCROLL</span>
        </div>
      </div>
    </section>
  );
}
