"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "rgba(26,18,8,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,168,75,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", maxWidth: 1400, margin: "0 auto" }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#d4a84b" }}>
            Charcoal <span style={{ color: "#e8702a" }}>Chicken</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-desktop" style={{ gap: "2.5rem", listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
          {[["#about","Our Story"],["#menu","Menu"],["#specials","Specials"]].map(([href,label]) => (
            <li key={href}>
              <a href={href} style={{ color: "#f5efe6", textDecoration: "none", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#reserve" style={{ backgroundColor: "#c94b0a", color: "white", padding: "0.55rem 1.4rem", borderRadius: "2px", textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.06em", textTransform: "uppercase", display: "block" }}>
              Reserve
            </a>
          </li>
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "#f5efe6", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 }}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ backgroundColor: "#1a1007", borderTop: "1px solid rgba(212,168,75,0.1)", padding: "1.5rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {[["#about","Our Story"],["#menu","Menu"],["#specials","Specials"],["#reserve","Reserve a Table"]].map(([href,label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ color: "#f5efe6", textDecoration: "none", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
