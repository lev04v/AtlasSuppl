import "../styles/sections.css";

export default function CompanyIntro() {
  return (
    <section id="about" className="section intro">
      <div className="container intro__inner">
        <div className="intro__lead">
          <p className="eyebrow">About Wellness CureCare</p>
          <h2 className="section__title">
            A trade partner built on reliability, not just reach.
          </h2>
        </div>
        <div className="intro__body">
          <p>
            Wellness CureCare is the healthcare trade arm of Wellexy Pharma
            &amp; Healthcare LLP, built to move quality pharmaceutical
            products, diagnostic equipment and hospital supplies from
            manufacturer to doorstep — reliably, and on time.
          </p>
          <p>
            We don't manufacture. We connect. Our role is to give
            manufacturers a dependable distribution partner, and give
            hospitals, pharmacies and healthcare institutions confidence in
            every delivery.
          </p>
          <a href="#partners" className="intro__link">
            See our partner network →
          </a>
        </div>
      </div>
    </section>
  );
}
