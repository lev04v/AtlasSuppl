import { Mail, MapPin, Phone, ArrowRight, ArrowUp } from "lucide-react";
import "./ContactFooter.css";

const footerLinks = {
  Company: [
    ["About us", "#story"],
    ["Our partners", "#partners"],
    ["Quality & Compliance", "#"],
    ["Careers", "#"],
  ],
  Products: [
    ["Pharmaceuticals", "#products"],
    ["Medical Devices", "#products"],
    ["Healthcare", "#products"],
    ["Consumables", "#products"],
  ],
  Resources: [
    ["Insights", "#insights"],
    ["FAQs", "#"],
    ["Downloads", "#"],
    ["Certifications", "#"],
  ],
  Contact: [
    ["Contact us", "#contact"],
    ["Business enquiry", "#enquiry"],
    ["Support", "#contact"],
  ],
};

export default function ContactFooter() {
  return (
    <>
      <section className="contact section" id="contact">
        <div className="map-panel">
          <div>
            <MapPin />
            <b>New Delhi, Delhi 110001</b>
            <p>Open the map for directions to our commercial office.</p>
            <a
              className="text-button"
              target="_blank"
              rel="noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=New+Delhi+Delhi+110001+India"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
        <div className="contact-card">
          <p className="eyebrow">Address details</p>
          <h2>Atlas Supply</h2>
          <p>
            <MapPin /> Atlas Supply, New Delhi, Delhi 110001, India (placeholder address)
          </p>
          <a href="tel:+919431011006">
            <Phone /> +91 12310 33696
          </a>
          <a href="tel:+919431001455">
            <Phone /> +91 12310 08669
          </a>
          <a href="mailto:info@wellexypharma.com">
            <Mail /> info@atlassuplly.com
          </a>
        </div>
      </section>

      <footer className="footer2">
        <div className="footer2-top">
          <div className="footer2-brand">
            <a href="#home" className="logo" aria-label="Atlas Supply home">
              <b aria-hidden="true">AS</b><span>Atlas <em>Supply</em></span>
            </a>
            <p className="footer2-tagline">Healthcare distribution, simplified.</p>
            <a href="#enquiry" className="footer2-cta">
              Let&apos;s Work Together <ArrowRight size={16} />
            </a>
            <div className="footer2-contactRow">
              <a href="mailto:info@wellexypharma.com">
                <Mail size={15} /> info@wellexypharma.com
              </a>
              <a href="tel:+919431011006">
                <Phone size={15} /> +91 94310 11006
              </a>
            </div>
          </div>

          <div className="footer2-visual" aria-hidden="true">
            <svg
              viewBox="0 0 420 300"
              className="footer2-molecule"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="fmNode" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#eaf6ff" />
                  <stop offset="35%" stopColor="#7fd0e8" />
                  <stop offset="100%" stopColor="#3a6fc9" />
                </radialGradient>
              </defs>
              <g stroke="#5f9fd6" strokeOpacity="0.35" strokeWidth="1.5" fill="none">
                <line x1="120" y1="90" x2="220" y2="150" />
                <line x1="220" y1="150" x2="180" y2="230" />
                <line x1="220" y1="150" x2="320" y2="110" />
                <line x1="320" y1="110" x2="360" y2="200" />
                <line x1="180" y1="230" x2="90" y2="210" />
              </g>
              <g className="footer2-molecule-nodes">
                <circle cx="120" cy="90" r="26" fill="url(#fmNode)" />
                <circle cx="220" cy="150" r="34" fill="url(#fmNode)" />
                <circle cx="180" cy="230" r="20" fill="url(#fmNode)" />
                <circle cx="320" cy="110" r="22" fill="url(#fmNode)" />
                <circle cx="360" cy="200" r="16" fill="url(#fmNode)" />
                <circle cx="90" cy="210" r="14" fill="url(#fmNode)" />
              </g>
            </svg>
          </div>

          <nav className="footer2-links" aria-label="Footer navigation">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4>{title}</h4>
                {links.map(([label, href]) => (
                  <a href={href} key={label}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer2-bottom">
          <small>© {new Date().getFullYear()} Atlas Supply. All rights reserved.</small>
          <div className="footer2-bottomRight">
            <a href="#">Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href="#">Terms &amp; Conditions</a>
            <button
              type="button"
              className="footer2-toTop"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
