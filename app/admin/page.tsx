"use client";
import { useEffect, useState, useRef } from "react";
import { supabase, type MenuItem } from "@/lib/supabase";

const CATEGORIES = ["signature", "sides", "drinks", "desserts"] as const;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "charcoal2024!";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "signature" as MenuItem["category"],
  tag: "",
  available: true,
};

// ─── Styles ──────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#0f0a04", color: "#f5efe6", fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties,
  header: { background: "#1a1007", borderBottom: "1px solid rgba(212,168,75,0.2)", padding: "1.2rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 } as React.CSSProperties,
  logo: { fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, color: "#d4a84b" } as React.CSSProperties,
  main: { maxWidth: 1100, margin: "0 auto", padding: "2rem 2.5rem" } as React.CSSProperties,
  card: { background: "#1a1007", border: "1px solid rgba(212,168,75,0.15)", borderRadius: "6px", padding: "2rem", marginBottom: "1.5rem" } as React.CSSProperties,
  label: { fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#d4a84b", marginBottom: "0.5rem", display: "block" },
  input: { width: "100%", padding: "0.75rem 1rem", background: "#231508", border: "1px solid rgba(212,168,75,0.25)", color: "#f5efe6", borderRadius: "4px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", outline: "none", marginBottom: 0 } as React.CSSProperties,
  btnPrimary: { padding: "0.75rem 2rem", background: "#c94b0a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.06em" } as React.CSSProperties,
  btnGhost: { padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(212,168,75,0.3)", color: "#d4a84b", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem" } as React.CSSProperties,
  btnDanger: { padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(201,75,10,0.4)", color: "#e8702a", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem" } as React.CSSProperties,
  btnSuccess: { padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(63,185,80,0.4)", color: "#3fb950", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem" } as React.CSSProperties,
};

export default function AdminPage() {
  // ─── Auth ───────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  function login() {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setAuthError(""); }
    else setAuthError("Incorrect password. Try again.");
  }

  // ─── Data ───────────────────────────────────────────────────
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ─── Form ───────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Toast ──────────────────────────────────────────────────
  const [toast, setToast] = useState({ msg: "", type: "ok" });
  function notify(msg: string, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3500);
  }

  // ─── Fetch ──────────────────────────────────────────────────
  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("created_at");
    if (error) { notify("Failed to load items: " + error.message, "err"); }
    else if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => { if (authed) fetchItems(); }, [authed]);

  // ─── Image picker ───────────────────────────────────────────
  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { notify("Image must be under 5MB", "err"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  // ─── Upload image to Supabase Storage ───────────────────────
  async function uploadImage(file: File): Promise<string | null> {
    setUploadProgress("Uploading image...");
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      notify("Image upload failed: " + error.message, "err");
      setUploadProgress("");
      return null;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
    setUploadProgress("");
    return data.publicUrl;
  }

  // ─── Delete old image from storage ──────────────────────────
  async function deleteOldImage(imageUrl: string) {
    try {
      const parts = imageUrl.split("/menu-images/");
      if (parts[1]) {
        await supabase.storage.from("menu-images").remove([parts[1]]);
      }
    } catch (_) {}
  }

  // ─── Save (create or update) ─────────────────────────────────
  async function saveItem() {
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      notify("Please fill in name, description and price.", "err");
      return;
    }
    setSaving(true);

    let image_url = currentImageUrl;

    // Upload new image if selected
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (!url) { setSaving(false); return; }
      // Delete old image if editing
      if (editingId && currentImageUrl) await deleteOldImage(currentImageUrl);
      image_url = url;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category,
      tag: form.tag.trim() || null,
      available: form.available,
      image_url,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("menu_items").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("menu_items").insert([payload]));
    }

    if (error) {
      notify("Save failed: " + error.message, "err");
    } else {
      notify(editingId ? "✅ Item updated!" : "✅ Item added to menu!");
      resetForm();
      fetchItems();
    }
    setSaving(false);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setCurrentImageUrl(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEdit(item: MenuItem) {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      tag: item.tag || "",
      available: item.available,
    });
    setEditingId(item.id);
    setCurrentImageUrl(item.image_url || null);
    setImagePreview(item.image_url || null);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleAvailable(item: MenuItem) {
    const { error } = await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    if (error) notify("Failed to update: " + error.message, "err");
    else { notify(item.available ? "Item hidden from menu" : "Item visible on menu"); fetchItems(); }
  }

  async function deleteItem(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    // Delete image from storage first
    if (item.image_url) await deleteOldImage(item.image_url);
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) notify("Delete failed: " + error.message, "err");
    else { notify("🗑️ Item deleted."); fetchItems(); }
  }

  // ─── Login screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ ...S.card, width: 400, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔥</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "#fdf8f3", marginBottom: "0.4rem" }}>Admin Panel</h1>
          <p style={{ color: "#9e9289", fontSize: "0.85rem", marginBottom: "2rem" }}>Charcoal Chicken — Menu Manager</p>
          <div style={{ marginBottom: "1rem" }}>
            <label style={S.label}>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              style={{ ...S.input, textAlign: "center" }}
            />
          </div>
          {authError && <div style={{ color: "#e8702a", fontSize: "0.85rem", marginBottom: "1rem" }}>{authError}</div>}
          <button onClick={login} style={{ ...S.btnPrimary, width: "100%" }}>Log In</button>
          <p style={{ color: "#9e9289", fontSize: "0.75rem", marginTop: "1.5rem" }}>
            Share this page URL with your client:<br />
            <strong style={{ color: "#d4a84b" }}>yoursite.com/admin</strong>
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          🔥 Charcoal Chicken{" "}
          <span style={{ color: "#9e9289", fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>/ Menu Admin</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ color: "#9e9289", fontSize: "0.8rem", textDecoration: "none" }}>
            View Website ↗
          </a>
          <button onClick={() => setAuthed(false)} style={S.btnGhost}>Log Out</button>
        </div>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: toast.type === "err" ? "#3d1010" : "#0f2d12", border: `1px solid ${toast.type === "err" ? "#c94b0a" : "#3fb950"}`, borderRadius: "6px", padding: "1rem 1.5rem", color: toast.type === "err" ? "#e8702a" : "#3fb950", zIndex: 999, fontSize: "0.9rem", maxWidth: 340 }}>
          {toast.msg}
        </div>
      )}

      <div style={S.main}>

        {/* ─── Add / Edit Form ─── */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showForm ? "1.8rem" : 0 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#fdf8f3" }}>
              {editingId ? "✏️ Edit Item" : "➕ Add New Item"}
            </h2>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              {editingId && (
                <button onClick={resetForm} style={S.btnGhost}>Cancel Edit</button>
              )}
              {!editingId && (
                <button onClick={() => { setShowForm(!showForm); resetForm(); }} style={S.btnGhost}>
                  {showForm ? "Cancel" : "+ Add Item"}
                </button>
              )}
            </div>
          </div>

          {(showForm || editingId) && (
            <div>
              <div className="admin-form-grid" style={{ marginBottom: "1.2rem" }}>
                <div>
                  <label style={S.label}>Item Name *</label>
                  <input style={S.input} placeholder="e.g. Half Charcoal Chicken" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Price (AUD) *</label>
                  <input style={S.input} type="number" step="0.50" min="0" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Category *</label>
                  <select style={{ ...S.input, cursor: "pointer" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MenuItem["category"] })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Tag (optional)</label>
                  <input style={S.input} placeholder="e.g. Best Seller, New, Spicy" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: "1.2rem" }}>
                <label style={S.label}>Description *</label>
                <textarea
                  style={{ ...S.input, minHeight: 90, resize: "vertical" }}
                  placeholder="Describe the dish — ingredients, cooking method, what makes it special..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={S.label}>Product Image</label>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Preview */}
                  <div style={{ width: 160, height: 120, background: "#231508", border: "1px dashed rgba(212,168,75,0.3)", borderRadius: "4px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ color: "#9e9289", fontSize: "0.75rem", textAlign: "center", padding: "0.5rem" }}>No image selected</span>
                    )}
                  </div>
                  {/* Controls */}
                  <div style={{ flex: 1 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={onImageChange}
                      style={{ display: "none" }}
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" style={{ ...S.btnGhost, display: "inline-block", cursor: "pointer", marginBottom: "0.8rem" }}>
                      📷 Choose Image
                    </label>
                    <p style={{ color: "#9e9289", fontSize: "0.78rem", lineHeight: 1.6 }}>
                      Accepted: JPG, PNG, WebP<br />
                      Max size: 5MB<br />
                      Recommended: 800×600px or wider
                    </p>
                    {imageFile && (
                      <p style={{ color: "#3fb950", fontSize: "0.78rem", marginTop: "0.5rem" }}>
                        ✓ {imageFile.name} selected
                      </p>
                    )}
                    {uploadProgress && (
                      <p style={{ color: "#d4a84b", fontSize: "0.78rem", marginTop: "0.5rem" }}>{uploadProgress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Available toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.8rem" }}>
                <label style={{ ...S.label, margin: 0 }}>Visibility on website:</label>
                <button
                  onClick={() => setForm({ ...form, available: !form.available })}
                  style={{ ...S.btnGhost, color: form.available ? "#3fb950" : "#e8702a", borderColor: form.available ? "rgba(63,185,80,0.4)" : "rgba(201,75,10,0.4)" }}
                >
                  {form.available ? "✓ Visible on Menu" : "✗ Hidden from Menu"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={saveItem} disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.6 : 1 }}>
                  {saving ? (uploadProgress || "Saving...") : editingId ? "Update Item" : "Add to Menu"}
                </button>
                <button onClick={resetForm} style={S.btnGhost}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Menu Items List ─── */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#fdf8f3" }}>
              Menu Items
            </h2>
            <span style={{ color: "#9e9289", fontSize: "0.85rem" }}>{items.length} total items</span>
          </div>

          {loading ? (
            <div style={{ color: "#9e9289", padding: "2rem 0", textAlign: "center" }}>Loading...</div>
          ) : items.length === 0 ? (
            <div style={{ color: "#9e9289", padding: "2rem 0", textAlign: "center" }}>No items yet. Click "+ Add Item" above to get started.</div>
          ) : (
            CATEGORIES.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: "2.5rem" }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4a84b", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(212,168,75,0.1)" }}>
                    {cat} ({catItems.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {catItems.map((item) => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#231508", borderRadius: "4px", border: "1px solid rgba(212,168,75,0.08)", flexWrap: "wrap" }}>
                        {/* Thumbnail */}
                        <div style={{ width: 64, height: 48, background: "#1a1007", borderRadius: "3px", overflow: "hidden", flexShrink: 0 }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🍽️</div>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontWeight: 500, color: "#fdf8f3", marginBottom: "0.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {item.name}
                            {!item.available && <span style={{ fontSize: "0.65rem", background: "rgba(201,75,10,0.2)", color: "#e8702a", padding: "0.1rem 0.4rem", borderRadius: "2px", letterSpacing: "0.05em" }}>HIDDEN</span>}
                            {item.tag && <span style={{ fontSize: "0.65rem", background: "rgba(212,168,75,0.15)", color: "#d4a84b", padding: "0.1rem 0.4rem", borderRadius: "2px" }}>{item.tag}</span>}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#9e9289" }}>{item.description.slice(0, 70)}...</div>
                        </div>
                        {/* Price */}
                        <div style={{ color: "#d4a84b", fontWeight: 500, minWidth: 55 }}>${item.price.toFixed(2)}</div>
                        {/* Actions */}
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button onClick={() => toggleAvailable(item)} style={item.available ? S.btnGhost : S.btnSuccess}>
                            {item.available ? "Hide" : "Show"}
                          </button>
                          <button onClick={() => startEdit(item)} style={S.btnGhost}>Edit</button>
                          <button onClick={() => deleteItem(item)} style={S.btnDanger}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        input::placeholder { color: #5a4f45; }
        textarea::placeholder { color: #5a4f45; }
        select option { background: #231508; color: #f5efe6; }
        input:focus, textarea:focus, select:focus { border-color: rgba(212,168,75,0.5) !important; }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
