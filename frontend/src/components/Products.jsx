import { ArrowRight, BadgeCheck, CheckCircle2, Headset, Truck } from "lucide-react";
import drugsMedicinesCard from "../assets/products/drugs.png";
import laboratoryEquipmentCard from "../assets/products/lab.png";
import orthopedicSoftGoodsCard from "../assets/products/orthopedic.png";
import surgicalConsumablesCard from "../assets/products/surgical.png";
import hospitalEquipmentCard from "../assets/products/hospital.png";
import nutritionIvTherapyCard from "../assets/products/Ivnutrition.png";
import "../styles/products.css";

const productCards = [
  {
    number: "01",
    title: ["Drugs &", "Medicines"],
    description: "A wide range of pharmaceutical formulations.",
    image: drugsMedicinesCard,
    theme: "mint",
    alt: "Pharmaceutical medicines",
  },
  {
    number: "02",
    title: ["Laboratory", "Equipment"],
    description: "Precision instruments for accurate results.",
    image: laboratoryEquipmentCard,
    theme: "blue",
    alt: "Laboratory equipment",
  },
  {
    number: "03",
    title: ["Orthopedic", "Soft Goods"],
    description: "Comfort, support & recovery solutions you can trust.",
    image: orthopedicSoftGoodsCard,
    theme: "violet",
    alt: "Orthopedic support products",
  },
  {
    number: "04",
    title: ["Surgical", "Consumables"],
    description: "High-quality disposables for safe surgical outcomes.",
    image: surgicalConsumablesCard,
    theme: "teal",
    alt: "Surgical consumables",
  },
  {
    number: "05",
    title: ["Hospital", "Equipment"],
    description: "Reliable equipment for modern healthcare.",
    image: hospitalEquipmentCard,
    theme: "amber",
    alt: "Hospital equipment",
  },
  {
    number: "06",
    title: ["Nutrition &", "IV Therapy"],
    description: "Nutritional support & IV solutions for better patient care.",
    image: nutritionIvTherapyCard,
    theme: "aqua",
    alt: "Nutrition and IV therapy products",
  },
];

const features = [
  {
    title: "Trusted Quality",
    description: "Products sourced from reputed manufacturers.",
    icon: CheckCircle2,
  },
  {
    title: "Regulatory Compliant",
    description: "All products meet global quality standards.",
    icon: BadgeCheck,
  },
  {
    title: "Reliable Supply",
    description: "Timely delivery with secure logistics.",
    icon: Truck,
  },
  {
    title: "Expert Support",
    description: "Our team is here to support your requirements.",
    icon: Headset,
  },
];

function DotGrid() {
  return (
    <span className="product-dot-grid" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
    </span>
  );
}

export default function Products() {
  return (
    <section className="product-universe section" id="products">
      <div className="product-universe__inner">
        <header className="product-universe__header">
          <div className="product-universe__heading">
            <div className="product-universe__eyebrow">
              <span>Product Universe</span>
              <span className="product-eyebrow-dots" aria-hidden="true">
                <span />
                <span />
              </span>
            </div>
            <h2>Supply areas that fit your buying requirements.</h2>
          </div>
          <p className="product-universe__intro">
            Category-level information only. Contact us to discuss approved product scope and commercial requirements.
          </p>
        </header>

        <div className="product-cards-grid">
          {productCards.map((card) => (
            <article className={`product-card product-card--${card.theme}`} key={card.number}>
              <div className="product-card__topline">
                <span className="product-card__number">{card.number}</span>
                <DotGrid />
              </div>
              <div className="product-card__content">
                <h3>{card.title.map((line) => <span key={line}>{line}</span>)}</h3>
                <p>{card.description}</p>
              </div>
              <img
                className="product-card__image"
                src={card.image}
                alt={card.alt}
                loading="lazy"
                decoding="async"
              />
              <a className="product-card__action" href="#contact" aria-label={`Enquire about ${card.alt}`}>
                <ArrowRight size={16} strokeWidth={2.4} />
              </a>
            </article>
          ))}
        </div>

        <div className="product-features" aria-label="Wellness CureCare benefits">
          {features.map(({ title, description, icon: Icon }) => (
            <div className="product-feature" key={title}>
              <span className="product-feature__icon"><Icon size={18} strokeWidth={2.2} /></span>
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
