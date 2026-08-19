import { useEffect, useRef, useState } from "react";
import { slides } from "../utils/siteData";
import "./StoryCarousel.css";

const WHEEL_COOLDOWN = 650; // ms between slide changes while scrubbing
const WHEEL_THRESHOLD = 4; // ignore tiny trackpad jitter

/**
 * Story carousel.
 * - Autoplays every 5s, same as before.
 * - While the mouse is over it, wheel motion drives slide changes instead
 *   of page scroll. Once you're past the first/last slide, wheel input
 *   is released back to the page so scrolling never feels trapped.
 * - Slides crossfade with a slow Ken Burns zoom instead of a hard cut.
 * - The image panel widens on hover for a fuller, more premium feel.
 */
export default function StoryCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [transitionId, setTransitionId] = useState(0);

  const sectionRef = useRef(null);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const lockTimeoutRef = useRef(null);

  indexRef.current = index;

  const goTo = (next) => {
    if (next < 0 || next >= slides.length || next === indexRef.current) return;
    setIndex(next);
    setTransitionId((t) => t + 1);
  };

  // Autoplay — pauses while hovered/scrubbing.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => {
        setTransitionId((t) => t + 1);
        return (i + 1) % slides.length;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  // Wheel-driven slide navigation while hovered.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      const goingNext = e.deltaY > 0;
      const atStart = indexRef.current === 0;
      const atEnd = indexRef.current === slides.length - 1;

      if ((goingNext && atEnd) || (!goingNext && atStart)) {
        // Past the last/first slide in this direction — hand scroll
        // control back to the page instead of trapping it here.
        return;
      }

      e.preventDefault();
      if (lockRef.current) return; // mid-transition, swallow extra ticks
      lockRef.current = true;
      goTo(indexRef.current + (goingNext ? 1 : -1));
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        lockRef.current = false;
      }, WHEEL_COOLDOWN);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", onWheel);
      clearTimeout(lockTimeoutRef.current);
    };
  }, []);

  const slide = slides[index];

  return (
    <section
      ref={sectionRef}
      className={`story sc-story${hovered ? " sc-hovered" : ""}`}
      id="story"
      onMouseEnter={() => {
        setPaused(true);
        setHovered(true);
      }}
      onMouseLeave={() => {
        setPaused(false);
        setHovered(false);
      }}
    >
      <div className="story-image sc-image">
        {slides.map((s, i) => (
          <div
            key={i === index ? `${i}-${transitionId}` : `${i}-idle`}
            className={`sc-slide${i === index ? " sc-active" : ""}`}
          >
            <img src={s.image} alt="" />
          </div>
        ))}
        <div className="sc-hint" aria-hidden="true">
          Scroll to browse
        </div>
      </div>

      <div className="story-copy">
        <p className="eyebrow">{slide.label}</p>
        <h2>{slide.title}</h2>
        <p>{slide.text}</p>
        <a className="story-scroll" href="#products">
          Scroll to explore <span />
        </a>
        <div className="dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === index ? "active" : ""}
              aria-label={`Show story ${i + 1}`}
              onClick={() => {
                setPaused(true);
                goTo(i);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
