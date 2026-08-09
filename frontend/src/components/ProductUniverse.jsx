import { supplyDivisions } from "../utils/productsData";
import "../styles/sections.css";

export default function ProductUniverse() {
  return (
    <section id="supplies" className="section supplies">
      <div className="container">
        <div className="supplies__head">
          <p className="eyebrow">What We Move</p>
          <h2 className="section__title">Our Supplies</h2>
        </div>

        <div className="supplies__grid">
          {supplyDivisions.map((item) => (
            <div key={item.code} className="supplies__card">
              <span className="supplies__code">{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
