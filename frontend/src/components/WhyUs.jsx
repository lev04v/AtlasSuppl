import { Clock, ShieldCheck, Truck, Users } from "lucide-react";
import "../styles/sections.css";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified Sourcing",
    desc: "Every product traced back to a certified manufacturer partner.",
  },
  {
    icon: Truck,
    title: "Time-Bound Delivery",
    desc: "Reliable distribution to your doorstep through our associate network.",
  },
  {
    icon: Users,
    title: "24 Partner Brands",
    desc: "A trusted bench of manufacturing and healthcare partners.",
  },
  {
    icon: Clock,
    title: "Since Day One",
    desc: "Built on the trade experience of Wellexy Pharma & Healthcare LLP.",
  },
];

export default function WhyUs() {
  return (
    <section className="section why">
      <div className="container">
        <p className="eyebrow">Why Wellness CureCare</p>
        <h2 className="section__title">Trade, done dependably.</h2>

        <div className="why__grid">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="why__card">
              <Icon size={22} strokeWidth={1.6} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
