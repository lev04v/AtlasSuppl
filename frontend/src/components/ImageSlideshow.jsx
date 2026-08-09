import { useEffect, useState } from "react";
import { slides } from "../utils/slideshowData";
import "../styles/slideshow.css";

const INTERVAL_MS = 4200;

export default function ImageSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="slideshow">
      {slides.map((slide, i) => (
        <div key={i} className={`slideshow__slide ${i === index ? "is-active" : ""}`}>
          <img src={slide.image} alt="" />
          <div className="slideshow__scrim" />
          <div className="slideshow__copy container">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h2>{slide.title}</h2>
          </div>
        </div>
      ))}

      <div className="slideshow__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slideshow__dot ${i === index ? "is-active" : ""}`}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
