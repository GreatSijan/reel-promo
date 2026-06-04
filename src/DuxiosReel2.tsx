// DuxiosReel2.tsx — v5
// 1080x1920, 30fps, 24 sekundi = 720 frames

import { useCurrentFrame, interpolate, Easing } from "remotion";

function a(frame: number, from: number, to: number, ease = Easing.out(Easing.cubic)) {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}

function FadeToBlack({ frame, startAt, duration = 24 }: { frame: number; startAt: number; duration?: number }) {
  const t = frame - startAt;
  if (t < 0 || t > duration) return null;
  const op = interpolate(t, [0, duration * 0.35, duration * 0.65, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <div style={{ position: "absolute", inset: 0, background: "#000", opacity: op, zIndex: 200, pointerEvents: "none" }} />;
}

// Blur → oštrina + veliki label u sredini
// showAt: frame kad počinje, color: boja teksta, text: PRIJE/POSLIJE
function SceneLabel({ frame, showAt, color, text }: { frame: number; showAt: number; color: string; text: string }) {
  const lf = frame - showAt;
  if (lf < 0 || lf > 70) return null;
  const blurAmount = interpolate(lf, [0, 45], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOpacity = interpolate(lf, [0, 6, 48, 62], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const overlayOpacity = interpolate(lf, [0, 6, 42, 55], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div style={{
        position: "absolute", inset: 0,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        background: `rgba(0,0,0,${overlayOpacity})`,
        zIndex: 50,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 60, opacity: labelOpacity,
      }}>
        <div style={{
          fontSize: 130, fontWeight: 900,
          color: color,
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textShadow: `0 0 60px ${color}cc, 0 0 120px ${color}55`,
          transform: `scale(${interpolate(lf, [0, 10], [0.85, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}>
          {text}
        </div>
      </div>
    </>
  );
}

// ─── SCENE 0: Hook (0–105, ~3.5s) ───────────────────────────────────────────
function SceneHook({ frame }: { frame: number }) {
  const line1In = a(frame, 5, 38, Easing.out(Easing.exp));
  const line2In = a(frame, 30, 62, Easing.out(Easing.exp));
  const line3In = a(frame, 55, 85, Easing.out(Easing.exp));
  const subIn   = a(frame, 76, 100);

  const scale1 = interpolate(frame, [5, 38], [1.18, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale2 = interpolate(frame, [30, 62], [1.18, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale3 = interpolate(frame, [55, 85], [1.18, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "0 70px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />

      {/* "Je li ovo" */}
      <div style={{ opacity: line1In, transform: `scale(${scale1})`, fontSize: 100, fontWeight: 900, color: "#fff", lineHeight: 1.0, fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", marginBottom: 4 }}>
        Je li ovo
      </div>

      {/* "TVOJA" — crveno */}
      <div style={{ opacity: line2In, transform: `scale(${scale2})`, fontSize: 120, fontWeight: 900, color: "#ff3333", lineHeight: 1.0, fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", marginBottom: 4, textShadow: "0 0 60px #ff333388" }}>
        TVOJA
      </div>

      {/* "web stranica?" */}
      <div style={{ opacity: line3In, transform: `scale(${scale3})`, fontSize: 100, fontWeight: 900, color: "#fff", lineHeight: 1.0, fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", marginBottom: 52 }}>
        web stranica?
      </div>

      <div style={{ opacity: subIn, fontSize: 24, color: "rgba(255,255,255,0.35)", fontFamily: "Arial, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        — Izgleda li ovako —
      </div>
    </div>
  );
}

// ─── SCENE 1: Prije #1 — loša web shop stranica (106–220) ────────────────────
function SceneBefore1({ frame }: { frame: number }) {
  const lf = frame - 106;
  const pageIn = a(lf, 22, 42);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      <div style={{ opacity: pageIn }}>
        <div style={{ background: "#fff", borderBottom: "2px solid #ccc", padding: "16px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>OTOK CRES SHOP</span>
          <div style={{ display: "flex", gap: 18 }}>
            {["Početna", "Proizvodi", "Kontakt"].map(t => (
              <span key={t} style={{ fontSize: 15, color: "#0066cc", textDecoration: "underline" }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ background: "linear-gradient(180deg, #2255aa, #1144aa)", padding: "42px 30px", textAlign: "center" }}>
          <div style={{ fontSize: 44, color: "#fff", fontWeight: "bold", marginBottom: 8, textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Suveniri s otoka Cresa!</div>
          <div style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>Majice, ručnici, šalice i još mnogo toga...</div>
          <div style={{ display: "inline-block", background: "#ff9900", color: "#fff", padding: "12px 36px", fontSize: 17, fontWeight: "bold", border: "2px solid #cc7700" }}>POGLEDAJ PONUDU →</div>
        </div>
        <div style={{ background: "#ffcc00", padding: "8px 20px", textAlign: "center", fontSize: 14, color: "#333", fontWeight: "bold" }}>
          🔥 AKCIJA! Besplatna dostava iznad 50€! Naruči danas! 🔥
        </div>
        <div style={{ padding: "18px 18px" }}>
          <div style={{ fontSize: 17, fontWeight: "bold", color: "#555", marginBottom: 12, borderBottom: "2px solid #ccc", paddingBottom: 6, textAlign: "center" }}>🏷️ NAŠI PROIZVODI 🏷️</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { name: "Majica Cres", price: "25€", emoji: "👕", bg: "#e8f0ff" },
              { name: "Ručnik Cres", price: "35€", emoji: "🏖️", bg: "#fff8e8" },
              { name: "Kapa Cres",   price: "20€", emoji: "🧢", bg: "#f0ffe8" },
              { name: "Šalica Cres", price: "15€", emoji: "☕", bg: "#ffe8e8" },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: p.bg, border: "2px solid #ccc", padding: "8px 6px", textAlign: "center" }}>
                <div style={{ width: "100%", height: 90, background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, fontSize: 32 }}>{p.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: "#333", marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 14, color: "#c00", fontWeight: "bold", marginBottom: 5 }}>{p.price}</div>
                <div style={{ background: "#2255aa", color: "#fff", padding: "5px", fontSize: 10 }}>Dodaj u košaricu</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "14px 18px", background: "#eee", margin: "0 18px", border: "1px solid #ccc" }}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: "#333", marginBottom: 5 }}>O NAMA</div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>Mi smo mali obiteljski shop sa otoka Cresa. Nudimo autentične suvenire i lifestyle proizvode. Svi naši proizvodi su s ljubavlju prema Cresu i Kvarneru.</div>
        </div>
        <div style={{ padding: "14px 18px", margin: "10px 18px 0", border: "1px solid #ddd", background: "#fafafa" }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#555", marginBottom: 5 }}>📞 KONTAKT</div>
          <div style={{ fontSize: 12, color: "#777" }}>Tel: 051/111-222 | info@otokshop.hr</div>
          <div style={{ fontSize: 12, color: "#777" }}>Radno vrijeme: Pon-Pet 9-17h, Sub 9-13h</div>
        </div>
        <div style={{ background: "#333", color: "#ccc", padding: "10px 18px", fontSize: 11, textAlign: "center", marginTop: 12 }}>
          © 2023 Otok Cres Shop | Designed by: webmaster_hr
        </div>
      </div>
      {/* PRIJE label — prikazuje se samo ovdje, jednom za obje "prije" stranice */}
      <SceneLabel frame={frame} showAt={106} color="#ff3333" text="PRIJE" />
    </div>
  );
}

// ─── SCENE 2: Prije #2 — loša sirupa stranica (221–310) ─────────────────────
function SceneBefore2({ frame }: { frame: number }) {
  const lf = frame - 221;
  const pageIn = a(lf, 0, 20);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: "Arial, sans-serif", opacity: pageIn }}>
      <div style={{ background: "#f0f0f0", borderBottom: "1px solid #ccc", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 19, fontWeight: "bold", color: "#555" }}>Sirupi d.o.o.</span>
        <div style={{ display: "flex", gap: 18 }}>
          {["Početna", "Proizvodi", "O nama"].map(t => (
            <span key={t} style={{ fontSize: 14, color: "#555" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: "32px 28px", textAlign: "center", borderBottom: "1px solid #eee", background: "#fafafa" }}>
        <div style={{ fontSize: 38, fontWeight: "bold", color: "#333", marginBottom: 8 }}>Voćni sirupi</div>
        <div style={{ fontSize: 16, color: "#888", marginBottom: 18 }}>Prirodni sirupi od voća. Dobro za zdravlje. Naručite odmah.</div>
        <div style={{ display: "inline-block", background: "#888", color: "#fff", padding: "11px 30px", fontSize: 16 }}>Naruči</div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontSize: 15, fontWeight: "bold", color: "#555", marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 5 }}>Naši proizvodi:</div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {["Naranča", "Limun", "Nar i Šipak", "Bazga", "Đumbir i Limun", "Mješavina"].map((s, i) => (
            <div key={i} style={{ width: "calc(33% - 6px)", background: "#f8f8f8", border: "1px solid #ddd", padding: "9px 7px" }}>
              <div style={{ width: "100%", height: 72, background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 5, fontSize: 22, color: "#aaa" }}>🍶</div>
              <div style={{ fontSize: 12, color: "#444", marginBottom: 2 }}>Sirup od {s.toLowerCase()}</div>
              <div style={{ fontSize: 11, color: "#888" }}>Cijena: upitajte</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 18px", background: "#f5f5f5", margin: "8px 18px", border: "1px solid #ddd" }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 4 }}>Kontakt</div>
        <div style={{ fontSize: 12, color: "#777" }}>Tel: 099/123-456 | sirupi@gmail.com | Pon-Pet 9-17h</div>
      </div>
      <div style={{ background: "#eee", padding: "9px 18px", textAlign: "center", fontSize: 10, color: "#999", marginTop: 8 }}>
        © Sirupi d.o.o. 2022. Sva prava pridržana.
      </div>
    </div>
  );
}

// ─── SCENE 3: Poslije #1 — No Stress on Cres (311–480) ──────────────────────
function SceneAfter1({ frame }: { frame: number }) {
  const lf = frame - 311;
  const pageIn  = a(lf, 22, 40);
  const navIn   = a(lf, 24, 46);
  const h1In    = a(lf, 40, 68, Easing.out(Easing.exp));
  const h2In    = a(lf, 58, 84, Easing.out(Easing.exp));
  const subIn   = a(lf, 80, 106);
  const ctaIn   = a(lf, 100, 124);
  const sec1In  = a(lf, 118, 140);
  const sec2In  = a(lf, 136, 158);
  const sec3In  = a(lf, 154, 174);
  const revIn   = a(lf, 155, 178);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#1a3a5c", fontFamily: "Arial, sans-serif", opacity: pageIn }}>
      {/* Nav */}
      <div style={{ padding: "20px 55px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.12)", opacity: navIn }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>no✦on</div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.45)" }}>STRESS CRES</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["Home", "Catalog", "Contact"].map(t => (
            <span key={t} style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "40px 55px 24px" }}>
        <div style={{ fontSize: 16, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 16, opacity: navIn }}>
          Authentic Souvenirs · Island of Cres
        </div>
        <div style={{ opacity: h1In, transform: `translateY(${(1-h1In)*40}px)`, fontSize: 86, fontWeight: 900, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 2 }}>No Stress</div>
        <div style={{ opacity: h2In, transform: `translateY(${(1-h2In)*40}px)`, fontSize: 86, fontWeight: 900, color: "#7eb8f7", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 22 }}>on Cres.</div>
        <div style={{ opacity: subIn, fontSize: 19, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 580, marginBottom: 28 }}>
          Discover authentic souvenirs and summer lifestyle products from the island of Cres, Croatia. T-shirts, towels, hats and more.
        </div>
        <div style={{ opacity: ctaIn, display: "inline-block", border: "1.5px solid rgba(255,255,255,0.45)", color: "#fff", padding: "14px 44px", fontSize: 17, letterSpacing: "0.08em", borderRadius: 100 }}>
          Shop Now →
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: "8px 55px 16px", display: "flex", gap: 14 }}>
        {[
          { name: "T-Shirt", label: "T-SHIRTS", emoji: "👕", in: sec1In, bg: "rgba(126,184,247,0.12)" },
          { name: "Towel",   label: "TOWELS",   emoji: "🏖️", in: sec2In, bg: "rgba(255,255,255,0.06)" },
          { name: "Cap",     label: "CAPS",     emoji: "🧢", in: sec3In, bg: "rgba(126,184,247,0.12)" },
        ].map((p, i) => (
          <div key={i} style={{ flex: 1, opacity: p.in, transform: `translateY(${(1-p.in)*28}px)`, background: p.bg, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>{p.emoji}</div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.38)", marginBottom: 5 }}>{p.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>No Stress on Cres {p.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Review */}
      <div style={{ padding: "0 55px", opacity: revIn }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px 22px" }}>
          <div style={{ fontSize: 13, color: "#7eb8f7", marginBottom: 8 }}>★★★★★</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 10 }}>
            "Savršen poklon za sve ljubitelje Cresa. Kvaliteta je izvrsna, a dizajn prepoznatljiv!"
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>— Ana K., Zagreb</div>
        </div>
      </div>

      {/* POSLIJE label — jednom za obje poslije scene */}
      <SceneLabel frame={frame} showAt={311} color="#33ff88" text="POSLIJE" />
    </div>
  );
}

// ─── SCENE 4: Poslije #2 — By Rubinić (481–660) ─────────────────────────────
function SceneAfter2({ frame }: { frame: number }) {
  const lf = frame - 481;
  const pageIn  = a(lf, 0, 20);
  const navIn   = a(lf, 4, 28);
  const h1In    = a(lf, 22, 52, Easing.out(Easing.exp));
  const h2In    = a(lf, 42, 70, Easing.out(Easing.exp));
  const subIn   = a(lf, 68, 94);
  const ctaIn   = a(lf, 90, 114);
  const prod1In = a(lf, 108, 130);
  const prod2In = a(lf, 126, 148);
  const prod3In = a(lf, 144, 165);
  const prod4In = a(lf, 162, 182);
  const quoteIn = a(lf, 152, 175);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f5efe6", fontFamily: "Georgia, serif", opacity: pageIn }}>
      {/* Nav */}
      <div style={{ padding: "18px 55px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(107,58,31,0.15)", opacity: navIn }}>
        <div style={{ fontSize: 22, fontWeight: "bold", color: "#6b3a1f" }}>By Rubinić</div>
        <div style={{ display: "flex", gap: 28 }}>
          {["POČETNA", "PROIZVODI", "O NAMA"].map(t => (
            <span key={t} style={{ fontSize: 12, color: "#6b3a1f", letterSpacing: "0.15em" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "28px 55px 18px", textAlign: "center" }}>
        <div style={{ opacity: h1In, transform: `translateY(${(1-h1In)*38}px)`, fontSize: 92, fontWeight: 900, color: "#6b3a1f", lineHeight: 1.0, letterSpacing: "-0.02em" }}>By</div>
        <div style={{ opacity: h2In, transform: `translateY(${(1-h2In)*38}px)`, fontSize: 92, fontWeight: 900, color: "#6b3a1f", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 18 }}>Rubinić.</div>
        <div style={{ opacity: subIn, fontSize: 18, color: "#a07050", lineHeight: 1.65, maxWidth: 560, margin: "0 auto 22px", fontStyle: "italic" }}>
          Izrađeno s pažnjom. Namjerno miješano.<br />Proizvedeno s domišljatošću.
        </div>
        <div style={{ opacity: ctaIn, display: "inline-block", background: "#6b3a1f", color: "#fff", padding: "13px 42px", fontSize: 13, letterSpacing: "0.12em", borderRadius: 4 }}>
          ISTRAŽITE NAŠE SIRUPE →
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: "8px 50px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#a07050", textAlign: "center", marginBottom: 12 }}>KOLEKCIJA</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { name: "Naranča",         label: "MEDITERANSKA NARANČA", emoji: "🍊", in: prod1In, bg: "#fff3e0" },
            { name: "Đumbir i Limun",  label: "SVJEŽI ĐUMBIR I LIMUN",  emoji: "🍋", in: prod2In, bg: "#fffde7" },
            { name: "Nar i Šipak",     label: "BOGATI NAR I ŠIPAK",     emoji: "🍷", in: prod3In, bg: "#fce4ec" },
            { name: "Bazga",           label: "LIVADSKA BAZGA",          emoji: "🌸", in: prod4In, bg: "#f3e5f5" },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, opacity: p.in, transform: `translateY(${(1-p.in)*28}px)`, background: p.bg, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{p.emoji}</div>
              <div style={{ padding: "9px 12px" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#a07050", marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#6b3a1f" }}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding: "12px 50px", opacity: quoteIn }}>
        <div style={{ background: "rgba(107,58,31,0.06)", border: "1px solid rgba(107,58,31,0.15)", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 15, color: "#a07050", fontStyle: "italic", lineHeight: 1.55, marginBottom: 10 }}>
            "Njihov pristup brendiranju je nenadmašan. Razumjeli su našu viziju od prvog dana."
          </div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#6b3a1f" }}>Tin Rubinić — CEO, By Rubinić</div>
        </div>
      </div>
    </div>
  );
}

// ─── CTA Overlay (od frame 672) ──────────────────────────────────────────────
function CtaOverlay({ frame }: { frame: number }) {
  const lf = frame - 672;
  if (lf < 0) return null;
  const bgIn  = a(lf, 0, 22);
  const duxIn = a(lf, 12, 38, Easing.out(Easing.exp));
  const h1In  = a(lf, 30, 58, Easing.out(Easing.exp));
  const subIn = a(lf, 52, 76);
  const ctaIn = a(lf, 68, 90);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `rgba(10,10,10,${bgIn * 0.95})`,
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      textAlign: "center", zIndex: 150,
      padding: "0 80px",
    }}>
      {/* "duxios" — zamjetljivo ali ne prenaglašeno */}
      <div style={{
        opacity: duxIn,
        fontSize: 36, fontWeight: 700,
        color: "rgba(255,255,255,0.55)",
        fontFamily: "Arial, sans-serif",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        marginBottom: 36,
      }}>
        duxios
      </div>

      {/* "Tvoj" zeleno + "red." bijelo */}
      <div style={{ opacity: h1In, transform: `scale(${0.92 + h1In * 0.08})`, display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36, flexWrap: "wrap" as const, justifyContent: "center" }}>
        <span style={{ fontSize: 112, fontWeight: 900, color: "#33ff88", fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", textShadow: "0 0 60px #33ff8866", lineHeight: 1.0 }}>Tvoj</span>
        <span style={{ fontSize: 112, fontWeight: 900, color: "#fff", fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", lineHeight: 1.0 }}>red.</span>
      </div>

      <div style={{ opacity: subIn, fontSize: 24, color: "rgba(255,255,255,0.45)", fontFamily: "Arial, sans-serif", marginBottom: 55, lineHeight: 1.55, maxWidth: 660 }}>
        Gradimo digitalna iskustva koja brzo djeluju.
      </div>

      <div style={{ opacity: ctaIn, transform: `scale(${0.94 + ctaIn * 0.06})`, border: "1.5px solid rgba(255,255,255,0.45)", color: "#fff", fontSize: 32, fontWeight: 700, fontFamily: "Arial, sans-serif", padding: "20px 68px", borderRadius: 100, letterSpacing: "0.04em" }}>
        duxios.com →
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export const DuxiosReel2: React.FC = () => {
  const frame = useCurrentFrame();

  const isHook  = frame < 106;
  const isBef1  = frame >= 106 && frame < 221;
  const isBef2  = frame >= 221 && frame < 311;
  const isAft1  = frame >= 311 && frame < 481;
  const isAft2  = frame >= 481;

  const fades = [
    { startAt: 94,  duration: 24 },
    { startAt: 210, duration: 22 },
    { startAt: 299, duration: 24 },
    { startAt: 469, duration: 24 },
    { startAt: 660, duration: 24 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {isHook && <SceneHook    frame={frame} />}
      {isBef1 && <SceneBefore1 frame={frame} />}
      {isBef2 && <SceneBefore2 frame={frame} />}
      {isAft1 && <SceneAfter1  frame={frame} />}
      {isAft2 && <SceneAfter2  frame={frame} />}
      <CtaOverlay frame={frame} />
      {fades.map((f, i) => (
        <FadeToBlack key={i} frame={frame} startAt={f.startAt} duration={f.duration} />
      ))}
    </div>
  );
};
