import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "../styles/navbar.css";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Our Supplies", href: "#supplies" },
  { label: "Our Partners", href: "#partners" },
  { label: "Director's Desk", href: "#director" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        <a href="#home" className="navbar__brand">
          <span className="navbar__brand-mark">WC</span>
          <span className="navbar__brand-name">
            Wellness <em>CureCare</em>
          </span>
        </a>

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn--primary navbar__cta">
          Partner With Us
        </a>

        <button
          className="navbar__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            Partner With Us
          </a>
        </div>
      )}
    </header>
  );
}
