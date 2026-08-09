import { Suspense, lazy, useState } from "react";
import { partners } from "../utils/partnersData";
import "../styles/partners.css";

const PartnerCube = lazy(() => import("../3d/PartnerCube"));
const BATCH_SIZE = 6;

export default function OurPartners() {
  const batchCount = Math.ceil(partners.length / BATCH_SIZE);
  const [active, setActive] = useState(0);

  return (
    <section id="partners" className="section section--dark partners">
      <div className="container partners__inner">
        <div className="partners__copy">
          <p className="eyebrow">Our Network</p>
          <h2 className="section__title">We deal in all divisions of</h2>
          <p className="partners__desc">
            {partners.length}+ manufacturing and healthcare brands trust
            Wellness CureCare to move their products to hospitals, pharmacies
            and healthcare institutions reliably and on time.
          </p>

          <div className="partners__dots" role="tablist" aria-label="Partner batch">
            {Array.from({ length: batchCount }).map((_, i) => (
              <span key={i} className={`partners__dot ${i === active ? "is-active" : ""}`} />
            ))}
          </div>
        </div>

        <div className="partners__cube">
          <Suspense fallback={<div className="partners__cube-fallback" />}>
            <PartnerCube onBatchChange={setActive} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
