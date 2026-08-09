import { Suspense, lazy, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollProgress } from "../utils/scrollProgress";
import "../styles/hero.css";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import("../3d/HeroScene"));

export default function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="hero__canvas">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      <div className="hero__scrim" />

      <div className="hero__content container">
        <p className="eyebrow">Pharmaceutical Trade &amp; Healthcare Distribution</p>
        <h1 className="hero__headline">
          Advancing
          <br />
          Healthcare. <span>Through Trust.</span>
        </h1>
        <p className="hero__desc">
          Connecting quality pharmaceutical products with trusted healthcare
          partners through reliable trade and distribution — a Wellexy Pharma
          &amp; Healthcare venture.
        </p>
        <div className="hero__actions">
          <a href="#supplies" className="btn btn--primary">
            Explore Products <ArrowRight size={16} />
          </a>
          <a href="#about" className="btn btn--ghost">
            Discover Our Company
          </a>
        </div>
      </div>

      <a href="#about" className="hero__scroll-cue" aria-label="Scroll to next section">
        <ChevronDown size={18} />
      </a>
    </section>
  );
}
