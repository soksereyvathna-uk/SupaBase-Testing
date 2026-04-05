"use client";

export default function About() {
  const stats = [
    { num: "15+", label: "Years Burning" },
    { num: "200k+", label: "Chickens Served" },
    { num: "12hr", label: "Marinade Time" },
  ];

  return (
    <section id="about" className="section-pad" style={{ backgroundColor: "#1a1208" }}>
      <div className="about-grid">
        {/* Text */}
        <div>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a84b", marginBottom: "1.2rem" }}>Our Story</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem", color: "#fdf8f3" }}>
            The Art of the Char
          </h2>
          <p style={{ color: "#9e9289", lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.2rem" }}>
            We started with a simple belief — that the best chicken in the world isn't complicated. It's patient. It's fire. It's time. Our pits burn hardwood charcoal sourced from sustainable forests, giving every bird that unmistakable depth of flavour you can't fake.
          </p>
          <p style={{ color: "#9e9289", lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "2.5rem" }}>
            Over 15 years we've perfected our dry rub, our 12-hour brine, and our low-and-slow cooking ritual. No shortcuts. No liquid smoke. Just the real thing.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 900, color: "#e8702a", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9e9289", marginTop: "0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div>
          <div style={{ backgroundColor: "#2d1a08", border: "1px solid rgba(212,168,75,0.2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", height: 240, marginBottom: "1rem" }}>🔥</div>
          <div style={{ backgroundColor: "#1e1208", border: "1px solid rgba(212,168,75,0.2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", height: 130 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 900, color: "#e8702a" }}>★ 4.9</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9e9289", marginTop: "0.3rem" }}>Google Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
