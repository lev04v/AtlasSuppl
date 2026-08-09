import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from "lucide-react";
import "../styles/sections.css";

export default function Footer() {
  return (
    <footer id="contact" className="footer section--dark">
      <div className="container footer__top">
        <div>
          <h4>Enquiries</h4>
          <p><Mail size={14} /> info@wellexypharma.com</p>
          <p><Mail size={14} /> wellexypharma@gmail.com</p>
        </div>
        <div>
          <h4>WhatsApp</h4>
          <p><Phone size={14} /> +91 94310 11006</p>
          <p><Phone size={14} /> +91 94310 01455</p>
        </div>
        <div>
          <h4>Open Hours</h4>
          <p>Mon–Sat: 10:00 AM – 7:30 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>

      <div className="container footer__inner">
        <div>
          <span className="navbar__brand-mark">WC</span>
          <p className="footer__tagline">
            The healthcare trade arm of Wellexy Pharma &amp; Healthcare
            Private Limited.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="WhatsApp"><MessageCircle size={16} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Director's Desk</a>
          <a href="#">Mission Statement</a>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <a href="#">Our Supplies</a>
          <a href="#">Careers</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="footer__col">
          <h4>Address</h4>
          <p>
            <MapPin size={14} />
            WZ-819/A, 1st Floor, 14/2 Adil Bagh, Palam Metro Gate No. 01,
            Sabzi Mandi Road, Palam Manglapuri, New Delhi, Delhi – 110045
          </p>
        </div>
      </div>

      <p className="footer__legal container">
        © {new Date().getFullYear()} Wellness CureCare — a Wellexy Pharma &amp; Healthcare venture.
      </p>
    </footer>
  );
}
