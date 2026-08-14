import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapSection from "../components/MapSection";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main>
        <section className="section">
          <div className="container">
            <p className="eyebrow">Contact</p>
            <h1 className="section__title">Dedicated support for healthcare partners</h1>
            <p className="map__intro">
              Reach Wellness CureCare for product enquiries, distribution support,
              or logistics coordination. Our dedicated contact page helps you
              connect with the right team faster.
            </p>
          </div>
        </section>

        <MapSection />
      </main>

      <Footer />
    </>
  );
}
