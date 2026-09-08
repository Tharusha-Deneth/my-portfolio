import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ThemeToggle from "../theme/ThemeToggle";
import "./header.css";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#portfolio" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`app-header ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="header-inner">
        {/* BRAND LOGO */}
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, "#home")}
          className="header-logo"
        >
          <span className="logo-badge">TD</span>
          <div className="logo-text">
            <span className="logo-name">Tharusha Deneth</span>
            <span className="logo-status">
              <span className="status-dot" />
              Available for work
            </span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="header-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* ACTIONS: THEME TOGGLE & HIRE BUTTON */}
        <div className="header-actions">
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="header-contact-btn"
          >
            <span>Let&apos;s Talk</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
