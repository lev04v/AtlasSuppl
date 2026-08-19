import Header from "../components/Header";
import ScrollVideoHero from "../components/ScrollVideoHero";
import StoryCarousel from "../components/StoryCarousel";
import Products from "../components/Products";
import Partners from "../components/Partners";
import Reasons from "../components/Reasons";
import Enquiry from "../components/Enquiry";
import ContactFooter from "../components/ContactFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ScrollVideoHero
          onExplore={() => (window.location.href = "/products")}
          onEnquiry={() =>
            document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" })
          }
        />
        <StoryCarousel />
        <Products />
        <Partners />
        <Reasons />
        <section className="insights section" id="insights">
          <p className="eyebrow">Insights / company updates</p>
          <h2>Updates, when they are ready to be shared.</h2>
          <p>We will publish approved company and category updates here.</p>
        </section>
        <Enquiry />
      </main>
      <ContactFooter />
    </>
  );
}
