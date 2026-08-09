import { useState } from "react";
import { Send } from "lucide-react";
import capsulesBg from "../assets/images/capsules-teal-vertical.jpg";
import "../styles/sections.css";

export default function PartnerWithUs() {
  const [form, setForm] = useState({ name: "", company: "", message: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend wired up yet — hook this to your API/contact service later.
    console.log("Partner inquiry submitted:", form);
  };

  return (
    <section id="partner-with-us" className="section section--dark partner-cta">
      <div className="container partner-cta__inner">
        <div className="partner-cta__copy">
          <p className="eyebrow">Work With Us</p>
          <h2 className="section__title">Become a distributor or business partner</h2>
          <p className="partner-cta__desc">
            Whether you're a manufacturer looking for distribution reach or a
            healthcare institution looking for a reliable supply partner,
            we'd like to hear from you.
          </p>
        </div>

        <form className="partner-cta__form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="company"
            placeholder="Company name"
            value={form.company}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Tell us about the partnership"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn--primary">
            Send Inquiry <Send size={16} />
          </button>
        </form>
      </div>

      <img className="partner-cta__bg" src={capsulesBg} alt="" aria-hidden="true" />
    </section>
  );
}
