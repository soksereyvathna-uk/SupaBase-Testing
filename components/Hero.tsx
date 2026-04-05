"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const embersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = embersRef.current;
    if (!container) return;
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("div");
      el.className = "ember-particle";
      el.style.left = Math.random() * 100 + "%";
      el.style.width = el.style.height = (2 + Math.random() * 3) + "px";
      el.style.animationDuration = (6 + Math.random() * 8) + "s";
      el.style.animationDelay = (Math.random() * 8) + "s";
      el.style.background = Math.random() > 0.5 ? "#d4a84b" : "#e8702a";
      container.appendChild(el);
    }
  }, []);

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#1a1208",
      background: "radial-gradient(ellipse at 60% 50%, #2d1a08 0%, #1a1208 70%)",
      paddingTop: "80px",
    }}>
      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 40%, rgba(201,75,10,0.18) 0%, transparent 50%)", pointerEvents: "none" }} />

      {/* Embers */}
      <div ref={embersRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }} />

      {/* Content */}
      <div className="animate-fade-up" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "2rem 1.5rem", width: "100%" }}>

        <div style={{ display: "inline-block", border: "1px solid #d4a84b", color: "#d4a84b", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.4rem 1.2rem", marginBottom: "2rem" }}>
          Est. 2008 · Fired Over Real Charcoal
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.8rem, 10vw, 7rem)", fontWeight: 900, lineHeight: 0.95, marginBottom: "1.5rem", color: "#fdf8f3" }}>
          Born From
          <br />
          <em style={{ fontStyle: "italic", color: "#e8702a" }}>the Flame</em>
        </h1>

        <p style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", color: "#9e9289", lineHeight: 1.8, maxWidth: 460, margin: "0 auto 2.5rem" }}>
          Slow-cooked over real hardwood charcoal. Smoky, tender, and unapologetically bold — this is chicken the way it was meant to be.
        </p>

        <div className="hero-buttons" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <a href="#menu" style={{ display: "block", background: "#c94b0a", color: "white", padding: "1rem 2rem", borderRadius: "2px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Explore Menu
          </a>
          <a href="#reserve" style={{ display: "block", background: "transparent", color: "#f5efe6", padding: "1rem 2rem", border: "1px solid rgba(245,239,230,0.35)", borderRadius: "2px", textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Book a Table
          </a>
        </div>

      </div>
    </section>
  );
}
