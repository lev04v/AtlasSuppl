import dnaHeroImage from "../assets/hero/dna-hero-reference-render.png";
import dnaHeroVideo from "../assets/hero/dna-hero-smooth-animation.mp4";
import "../components/DNA/DNA.css";

export default function DNAHero() {
  return (
    <div className="dna-canvas dna-hero-image" aria-label="Animated molecular DNA structure">
      <video
        className="dna-hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={dnaHeroImage}
        aria-label="Smoothly animated molecular DNA structure"
      >
        <source src={dnaHeroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
