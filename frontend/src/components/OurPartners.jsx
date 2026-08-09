import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { partners } from "../utils/partnersData";
import "../styles/partners.css";

const PartnerCube = lazy(() => import("../3d/PartnerCube"));

export default function OurPartners() {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return; // once true, stay mounted — don't tear the context down again
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "300px 0px" } // start creating the WebGL context a bit before it's on screen
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <section id="partners" className="section section--dark partners">
      <div className="container partners__inner">
        <div className="partners__copy">
          <p className="eyebrow">Our Network</p>
          <h2 className="section__title">We deal in all divisions of</h2>
          <p className="partners__desc">
            {partners.length}+ manufacturing and healthcare brands trust
            Wellness CureCare to move their products to hospitals, pharmacies
            and healthcare institutions reliably and on time. Hover a tile,
            click through to the brand.
          </p>
        </div>

        <div className="partners__cube" ref={containerRef}>
          {inView ? (
            <Suspense fallback={<div className="partners__cube-fallback">Loading…</div>}>
              <PartnerCube />
            </Suspense>
          ) : (
            <div className="partners__cube-fallback" />
          )}
        </div>
      </div>
    </section>
  );
}
