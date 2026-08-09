import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CompanyIntro from "../components/CompanyIntro";
import ProductUniverse from "../components/ProductUniverse";
import OurPartners from "../components/OurPartners";
import WhyUs from "../components/WhyUs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CompanyIntro />
      <ProductUniverse />
      <OurPartners />
      <WhyUs />
      <Footer />
    </>
  );
}
