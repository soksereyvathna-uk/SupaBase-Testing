"use client";
import { useState } from "react";

export function InfoStrip() {
  return (
    <div className="info-strip">
      {["🔥 Open Daily 11am – 10pm","📍 123 Grill Lane, Melbourne","⭐ Best Chicken 2023 & 2024","📞 (03) 9123 4567"].map((item, i) => (
        <span key={i} className="strip-item">{item}</span>
      ))}
    </div>
  );
}

export function Specials() {
  return (
    <section id="specials" className="section-pad" style={{ background: "#1a1208" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a84b", textAlign: "center", marginBottom: "0.5rem" }}>This Week</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fdf8f3", textAlign: "center", marginBottom: "3rem" }}>Chef's Specials</h2>
        <div className="specials-grid">
          {[
            { icon: "🍗", title: "The Full Bird", desc: "Our signature whole charcoal chicken, brined for 12 hours in our secret herb mix, then slow-roasted over hardwood coals until the skin is dark, crackled, and impossibly crisp. Served with roasted garlic, seasonal greens, and house-made gravy.", price: "$42", note: "feeds 2" },
            { icon: "🌽", title: "Charred Corn Elote", desc: "Fire-roasted corn, cotija cheese, our smoky chili butter. A side worth ordering twice.", price: "$9", note: "" },
          ].map((s) => (
            <div key={s.title} style={{ background: "#1a1007", padding: "2.5rem", borderLeft: "3px solid #c94b0a" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1.2rem" }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: "#fdf8f3", marginBottom: "0.8rem" }}>{s.title}</h3>
              <p style={{ color: "#9e9289", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>{s.desc}</p>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "#e8702a" }}>
                {s.price}{s.note && <span style={{ fontSize: "0.85rem", color: "#9e9289", fontFamily: "'DM Sans',sans-serif", fontWeight: 300, marginLeft: "0.5rem" }}>{s.note}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const reviews = [
    { text: "The best charcoal chicken I've ever had. The skin is unreal — dark, crispy, smoky. I drive 40 minutes just to come here.", author: "Sarah K., Melbourne" },
    { text: "Went for lunch on a whim, stayed for two hours. Everything from the chicken to the sides is executed with real care.", author: "James T., Fitzroy" },
    { text: "My family's favourite Sunday spot. The kids love the junior meals, we love the wine list. Perfect every single time.", author: "Mei L., Richmond" },
  ];
  return (
    <section className="section-pad" style={{ background: "#0d0804" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a84b", textAlign: "center", marginBottom: "0.5rem" }}>What People Say</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fdf8f3", textAlign: "center", marginBottom: "3.5rem" }}>Loved by Locals</h2>
        <div className="testimonials-grid">
          {reviews.map((r) => (
            <div key={r.author} style={{ background: "#15100a", padding: "2.5rem" }}>
              <div style={{ color: "#d4a84b", fontSize: "0.9rem", marginBottom: "1.2rem" }}>★★★★★</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1rem", color: "#f5efe6", lineHeight: 1.8, marginBottom: "1.5rem" }}>"{r.text}"</div>
              <div style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#9e9289" }}>— {r.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reservation() {
  const [form, setForm] = useState({ name: "", date: "", guests: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!form.name || !form.date || !form.guests) { alert("Please fill in all fields."); return; }
    setSubmitted(true);
  }

  return (
    <section id="reserve" className="section-pad" style={{ background: "#c94b0a", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(5rem,18vw,18rem)", fontWeight: 900, color: "rgba(255,255,255,0.04)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}>RESERVE</div>
      <div style={{ position: "relative" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 900, color: "white", marginBottom: "1rem" }}>Reserve Your Table</h2>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", marginBottom: "2.5rem" }}>Call us, walk in, or book below — we'll have a fire ready.</p>
        {submitted ? (
          <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "4px", padding: "2rem 3rem", display: "inline-block", color: "white" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔥</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", marginBottom: "0.3rem" }}>See you soon, {form.name}!</div>
            <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>Booking for {form.date} · {form.guests} guest{Number(form.guests) > 1 ? "s" : ""}</div>
          </div>
        ) : (
          <>
            <div className="reservation-form">
              <input className="reservation-input" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="reservation-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input className="reservation-input" type="number" placeholder="Guests" min="1" max="20" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} style={{ maxWidth: 110 }} />
              <button onClick={handleSubmit} style={{ padding: "1rem 1.8rem", background: "#1a1208", color: "#d4a84b", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Book Now
              </button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", marginTop: "1.2rem", position: "relative" }}>
              Or call: <strong style={{ color: "white" }}>(03) 9123 4567</strong>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Navigate", items: ["Our Story","Menu","Specials","Catering","Gift Cards"] },
    { title: "Hours", items: ["Mon – Fri: 11am – 10pm","Sat: 10am – 11pm","Sun: 10am – 9pm"] },
    { title: "Find Us", items: ["123 Grill Lane","Melbourne VIC 3000","(03) 9123 4567","hello@charcoalchicken.com.au"] },
  ];
  return (
    <footer style={{ background: "#0a0602", padding: "4rem 2rem 2rem", borderTop: "1px solid rgba(212,168,75,0.1)" }}>
      <div className="footer-grid">
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#d4a84b", marginBottom: "1rem" }}>
            Charcoal <span style={{ color: "#e8702a" }}>Chicken</span>
          </div>
          <div style={{ color: "#9e9289", fontSize: "0.85rem", lineHeight: 1.8 }}>Real fire. Real flavour. A restaurant built on patience and the belief that great food never needs shortcuts.</div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4a84b", marginBottom: "1.2rem" }}>{col.title}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {col.items.map((item) => <li key={item} style={{ color: "#9e9289", fontSize: "0.85rem", marginBottom: "0.6rem" }}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", color: "#9e9289", flexWrap: "wrap", gap: "0.5rem" }}>
        <span>© {new Date().getFullYear()} Charcoal Chicken. All rights reserved.</span>
        <span>Built with Next.js + Supabase</span>
      </div>
    </footer>
  );
}
