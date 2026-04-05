"use client";
import { useEffect, useState } from "react";
import { supabase, type MenuItem } from "@/lib/supabase";

const CATEGORIES = ["all", "signature", "sides", "drinks", "desserts"] as const;

export default function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("menu_items").select("*").eq("available", true)
      .order("category").order("created_at")
      .then(({ data, error }) => {
        if (!error && data) setItems(data);
        setLoading(false);
      });
  }, []);

  const displayed = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <section id="menu" className="section-pad section-dark" style={{ backgroundColor: "#120c04" }}>

      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 3rem" }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a84b", marginBottom: "1rem" }}>What We Serve</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#fdf8f3", marginBottom: "1rem" }}>The Menu</h2>
        <p style={{ color: "#9e9289", fontSize: "0.95rem", lineHeight: 1.8 }}>Everything cooked to order. No heat lamps, no shortcuts.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "0.5rem", padding: "0 1rem" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: filter === cat ? "#c94b0a" : "transparent",
            border: "1px solid rgba(212,168,75,0.3)",
            color: filter === cat ? "white" : "#9e9289",
            cursor: "pointer",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "capitalize",
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: 2,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#9e9289", padding: "3rem" }}>Loading menu...</div>
      ) : (
        <div className="menu-grid">
          {displayed.map((item) => (
            <div key={item.id} style={{ backgroundColor: "#1a1007", border: "1px solid rgba(212,168,75,0.1)", borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Image */}
              <div style={{ width: "100%", height: 200, backgroundColor: "#231508", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9e9289", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>No image yet</div>
                }
                {item.tag && (
                  <div style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "#c94b0a", color: "white", padding: "0.25rem 0.6rem", borderRadius: 1 }}>
                    {item.tag}
                  </div>
                )}
              </div>
              {/* Text */}
              <div style={{ padding: "1.2rem 1.4rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fdf8f3", marginBottom: "0.5rem" }}>{item.name}</div>
                <div style={{ fontSize: "0.82rem", color: "#9e9289", lineHeight: 1.7, flex: 1, marginBottom: "1rem" }}>{item.description}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 500, color: "#d4a84b" }}>${item.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#9e9289", padding: "3rem" }}>No items in this category yet.</div>
          )}
        </div>
      )}
    </section>
  );
}
