import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "../styles/navbar.css";

/* These are placeholders for now — clicking them does nothing on purpose.
   Once each of these becomes its own real page/route, swap `disabled`
   for a real `href`/`to` and this component needs no other changes. */
const LINKS = [
  { label: "Home", disabled: false, href: "#home" },
  { label: "About", disabled: true },
  { label: "Our Supplies", disabled: true },
  { label: "Our Partners", disabled: true },
  { label: "Latest News", disabled: true },
  { label: "Partner With Us", disabled: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e, link) => {
    if (link.disabled) e.preventDefault();
    setOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        <a href="#home" className="navbar__brand" onClick={(e) => handleClick(e, { disabled: false })}>
          <span className="navbar__brand-mark">WC</span>
          <span className="navbar__brand-name">
            Wellness <em>CureCare</em>
          </span>
        </a>

        <nav className="navbar__links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href ?? "#"}
              className={link.disabled ? "is-disabled" : ""}
              onClick={(e) => handleClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#" className="btn btn--primary navbar__cta" onClick={(e) => handleClick(e, { disabled: true })}>
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
            <a
              key={link.label}
              href={link.href ?? "#"}
              className={link.disabled ? "is-disabled" : ""}
              onClick={(e) => handleClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
