import { Clock, MapPin, Mail, Phone } from "lucide-react";
import "../styles/sections.css";

const ADDRESS = "Atlas Supply, New Delhi, Delhi 110001, India (placeholder address)";
const MAP_QUERY = encodeURIComponent(ADDRESS);
const MAP_SRC = `https://maps.google.com/maps?q=${MAP_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export default function MapSection() {
  return (
    <section className="section map-section" aria-labelledby="map-section-title">
      <div className="container">
        <div className="section__head">
          <p className="eyebrow">Our Location</p>
          <h2 id="map-section-title" className="section__title">
            Locate Atlas Supply in New Delhi
          </h2>
          <p className="map__intro">
            Visit our logistics hub and customer support centre in the heart of New Delhi. The map below helps partners and visitors find us quickly, whether you are scheduling deliveries or meeting our team.
          </p>
        </div>

        <div className="map-grid">
          <div className="map-frame">
            <iframe
              src={MAP_SRC}
              title="Atlas Supply location on Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className="map-card">
            <span className="map-card__label">Address details</span>
            <h3>Atlas Supply</h3>
            <p className="map-card__text">
              <MapPin size={18} />
              {ADDRESS}
            </p>
            <p className="map-card__text">
              <Phone size={18} />
              +91 94310 11006
            </p>
            <p className="map-card__text">
              <Phone size={18} />
              +91 94310 01455
            </p>
            <p className="map-card__text">
              <Mail size={18} />
              info@wellexypharma.com
            </p>
            <p className="map-card__text">
              <Clock size={18} />
              Mon–Sat: 10:00 AM – 7:30 PM
            </p>
            <a
              className="btn btn--primary map-card__btn"
              href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open in Google Maps
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
