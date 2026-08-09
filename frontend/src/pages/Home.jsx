import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ImageSlideshow from "../components/ImageSlideshow";
import CompanyIntro from "../components/CompanyIntro";
import ProductUniverse from "../components/ProductUniverse";
import OurPartners from "../components/OurPartners";
import WhyUs from "../components/WhyUs";
import LatestNews from "../components/LatestNews";
import PartnerWithUs from "../components/PartnerWithUs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ImageSlideshow />
      <CompanyIntro />
      <ProductUniverse />
      <OurPartners />
      <WhyUs />
      <LatestNews />
      <PartnerWithUs />
      <Footer />
    </>
  );
}
