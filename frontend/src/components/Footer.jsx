import { Mail, MapPin, Phone } from "lucide-react";
import "../styles/sections.css";

export default function Footer() {
  return (
    <footer id="contact" className="footer section--dark">
      <div className="container footer__inner">
        <div>
          <span className="navbar__brand-mark">WC</span>
          <p className="footer__tagline">
            The healthcare trade arm of Wellexy Pharma &amp; Healthcare LLP.
          </p>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <p><Mail size={14} /> info@wellexypharma.com</p>
          <p><Phone size={14} /> +91 94310 11006</p>
          <p><MapPin size={14} /> New Delhi, India</p>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#supplies">Our Supplies</a>
          <a href="#partners">Our Partners</a>
        </div>
      </div>

      <p className="footer__legal container">
        © {new Date().getFullYear()} Wellness CureCare — a Wellexy Pharma &amp; Healthcare venture.
      </p>
    </footer>
  );
}
