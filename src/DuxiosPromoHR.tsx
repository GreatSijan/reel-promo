// DuxiosPromoHR.tsx — Duxios Promo Reel (Hrvatski)
// 1080x1920, 30fps, 15 sekundi = 450 frames

import { useCurrentFrame, interpolate, Easing, Audio, staticFile } from "remotion";

function a(frame: number, from: number, to: number, ease = Easing.out(Easing.cubic)) {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}

function FadeToBlack({ frame, startAt, duration = 20 }: { frame: number; startAt: number; duration?: number }) {
  const t = frame - startAt;
  if (t < 0 || t > duration) return null;
  const op = interpolate(t, [0, duration * 0.4, duration * 0.6, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <div style={{ position: "absolute", inset: 0, background: "#000", opacity: op, zIndex: 200, pointerEvents: "none" }} />;
}

// ─── SCENE 0: Intro (0–80) ───────────────────────────────────────────────────
function SceneIntro({ frame }: { frame: number }) {
  const tagIn  = a(frame, 5, 28);
  const h1In   = a(frame, 20, 48, Easing.out(Easing.exp));
  const h2In   = a(frame, 38, 65, Easing.out(Easing.exp));
  const lineIn = a(frame, 58, 75);

  const scale1 = interpolate(frame, [20, 48], [1.15, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale2 = interpolate(frame, [38, 65], [1.15, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", textAlign: "center",
      padding: "0 80px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)", pointerEvents: "none" }} />

      <div style={{ opacity: tagIn, fontSize: 24, letterSpacing: "0.28em", color: "rgba(255,255,255,0.35)", fontFamily: "Arial, sans-serif", textTransform: "uppercase", marginBottom: 36 }}>
        — digitalna agencija —
      </div>
      <div style={{ opacity: h1In, transform: `scale(${scale1})`, fontSize: 120, fontWeight: 900, color: "#fff", lineHeight: 1.0, fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", marginBottom: 6 }}>
        duxios
      </div>
      <div style={{ opacity: h2In, transform: `scale(${scale2})`, fontSize: 52, fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.0, fontFamily: "Arial, sans-serif", letterSpacing: "0.02em", marginBottom: 50 }}>
        Gradimo digitalna iskustva
      </div>
      <div style={{ width: `${lineIn * 160}px`, height: 1.5, background: "rgba(255,255,255,0.2)" }} />
    </div>
  );
}

// ─── SCENE 1: Web stranice (81–185) ─────────────────────────────────────────
function SceneWeb({ frame }: { frame: number }) {
  const lf = frame - 81;
  const numIn   = a(lf, 0, 20);
  const titleIn = a(lf, 15, 42, Easing.out(Easing.exp));
  const descIn  = a(lf, 38, 62);
  const feat1In = a(lf, 56, 76);
  const feat2In = a(lf, 70, 90);
  const feat3In = a(lf, 84, 104);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        {/* Number */}
        <div style={{ opacity: numIn, fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.06)", lineHeight: 1.0, marginBottom: -30, letterSpacing: "-0.05em" }}>01</div>

        {/* Title */}
        <div style={{ opacity: titleIn, transform: `translateY(${(1-titleIn)*40}px)`, fontSize: 82, fontWeight: 900, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 22 }}>
          Izrada web<br />stranica.
        </div>

        {/* Desc */}
        <div style={{ opacity: descIn, fontSize: 26, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680, marginBottom: 44 }}>
          Visoko performantne, responzivne web stranice izrađene najnovijim tehnologijama.
        </div>

        {/* Features */}
        {[
          "Brze i optimizirane za rezultate",
          "Moderni dizajn prilagođen brendu",
          "SEO optimizacija uključena",
        ].map((f, i) => {
          const eachIn = [feat1In, feat2In, feat3In][i];
          return (
            <div key={i} style={{ opacity: eachIn, transform: `translateX(${(1-eachIn)*30}px)`, display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
              <span style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{f}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <div style={{ position: "absolute", bottom: 60, left: 80, opacity: numIn }}>
        <div style={{ fontSize: 18, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>duxios.com</div>
      </div>
    </div>
  );
}

// ─── SCENE 2: Branding (186–290) ────────────────────────────────────────────
function SceneBranding({ frame }: { frame: number }) {
  const lf = frame - 186;
  const numIn   = a(lf, 0, 20);
  const titleIn = a(lf, 15, 42, Easing.out(Easing.exp));
  const descIn  = a(lf, 38, 62);
  const feat1In = a(lf, 56, 76);
  const feat2In = a(lf, 70, 90);
  const feat3In = a(lf, 84, 104);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ opacity: numIn, fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.06)", lineHeight: 1.0, marginBottom: -30, letterSpacing: "-0.05em" }}>02</div>
        <div style={{ opacity: titleIn, transform: `translateY(${(1-titleIn)*40}px)`, fontSize: 82, fontWeight: 900, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 22 }}>
          Brendiranje<br />& identitet.
        </div>
        <div style={{ opacity: descIn, fontSize: 26, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680, marginBottom: 44 }}>
          Prepoznatljivi vizualni sustavi koji hvataju bit vašeg brenda.
        </div>
        {[
          "Logo i vizualni identitet",
          "Brand guidelines i strategija",
          "Kompletno brendiranje od nule",
        ].map((f, i) => {
          const eachIn = [feat1In, feat2In, feat3In][i];
          return (
            <div key={i} style={{ opacity: eachIn, transform: `translateX(${(1-eachIn)*30}px)`, display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
              <span style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{f}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 80, opacity: numIn }}>
        <div style={{ fontSize: 18, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>duxios.com</div>
      </div>
    </div>
  );
}

// ─── SCENE 3: Social Media (291–390) ────────────────────────────────────────
function SceneSocial({ frame }: { frame: number }) {
  const lf = frame - 291;
  const numIn   = a(lf, 0, 20);
  const titleIn = a(lf, 15, 42, Easing.out(Easing.exp));
  const descIn  = a(lf, 38, 62);
  const feat1In = a(lf, 56, 76);
  const feat2In = a(lf, 70, 90);
  const feat3In = a(lf, 84, 104);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <div style={{ opacity: numIn, fontSize: 160, fontWeight: 900, color: "rgba(255,255,255,0.06)", lineHeight: 1.0, marginBottom: -30, letterSpacing: "-0.05em" }}>03</div>
        <div style={{ opacity: titleIn, transform: `translateY(${(1-titleIn)*40}px)`, fontSize: 82, fontWeight: 900, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 22 }}>
          Marketing na<br />društvenim<br />mrežama.
        </div>
        <div style={{ opacity: descIn, fontSize: 26, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 680, marginBottom: 44 }}>
          Strateške kampanje koje rastu vašu publiku i povećavaju angažman.
        </div>
        {[
          "Instagram, TikTok, LinkedIn",
          "Sadržaj koji konvertira",
          "Mjerljivi rezultati",
        ].map((f, i) => {
          const eachIn = [feat1In, feat2In, feat3In][i];
          return (
            <div key={i} style={{ opacity: eachIn, transform: `translateX(${(1-eachIn)*30}px)`, display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
              <span style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{f}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 80, opacity: numIn }}>
        <div style={{ fontSize: 18, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>duxios.com</div>
      </div>
    </div>
  );
}

// ─── SCENE 4: CTA (391–450) ─────────────────────────────────────────────────
function SceneCTA({ frame }: { frame: number }) {
  const lf = frame - 391;
  const bgIn  = a(lf, 0, 20);
  const h1In  = a(lf, 12, 38, Easing.out(Easing.exp));
  const h2In  = a(lf, 28, 52, Easing.out(Easing.exp));
  const subIn = a(lf, 46, 68);
  const ctaIn = a(lf, 60, 80);
  const pulse = (Math.sin(lf * 0.18) * 0.5 + 0.5) * ctaIn;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#0a0a0a",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      textAlign: "center", padding: "0 80px",
      opacity: bgIn,
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ opacity: h1In * 0.4, fontSize: 22, letterSpacing: "0.3em", color: "#fff", fontFamily: "Arial, sans-serif", textTransform: "uppercase", marginBottom: 28 }}>duxios</div>
      <div style={{ opacity: h1In, transform: `scale(${0.92 + h1In * 0.08})`, fontSize: 108, fontWeight: 900, color: "#fff", fontFamily: "Arial, sans-serif", letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 10 }}>
        Vaš red.
      </div>
      <div style={{ opacity: h2In, fontSize: 34, fontWeight: 400, color: "rgba(255,255,255,0.5)", fontFamily: "Arial, sans-serif", lineHeight: 1.5, marginBottom: 55, maxWidth: 700 }}>
        Gradimo digitalna iskustva koja brzo djeluju.
      </div>
      <div style={{
        opacity: ctaIn, transform: `scale(${0.94 + ctaIn * 0.06})`,
        border: "1.5px solid rgba(255,255,255,0.5)",
        color: "#fff", fontSize: 34, fontWeight: 700,
        fontFamily: "Arial, sans-serif",
        padding: "22px 72px", borderRadius: 100,
        letterSpacing: "0.04em",
        boxShadow: `0 0 ${30 + pulse * 50}px rgba(255,255,255,${0.05 + pulse * 0.1})`,
      }}>
        Javite nam se →
      </div>
      <div style={{ opacity: subIn, marginTop: 28, fontSize: 22, color: "rgba(255,255,255,0.3)", fontFamily: "Arial, sans-serif", letterSpacing: "0.12em" }}>
        duxios.com
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export const DuxiosPromoHR: React.FC = () => {
  const frame = useCurrentFrame();

  const isIntro   = frame < 81;
  const isWeb     = frame >= 81  && frame < 186;
  const isBrand   = frame >= 186 && frame < 291;
  const isSocial  = frame >= 291 && frame < 391;
  const isCTA     = frame >= 391;

  const fades = [
    { startAt: 70,  duration: 22 },
    { startAt: 175, duration: 22 },
    { startAt: 280, duration: 22 },
    { startAt: 380, duration: 22 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Audio */}
      <Audio src={staticFile("dark-drone-ambient.mp3")} startFrom={0} volume={0.4} />
      <Audio src={staticFile("cinematic-impact-hit.mp3")} startFrom={0} volume={0.9} />
      <Audio src={staticFile("woosh-cinematic.mp3")} startFrom={0} volume={0.7} />
      <Audio src={staticFile("woosh-cinematic.mp3")} startFrom={0} volume={0.7} delay={175} />
      <Audio src={staticFile("woosh-cinematic.mp3")} startFrom={0} volume={0.7} delay={280} />

      {isIntro  && <SceneIntro    frame={frame} />}
      {isWeb    && <SceneWeb      frame={frame} />}
      {isBrand  && <SceneBranding frame={frame} />}
      {isSocial && <SceneSocial   frame={frame} />}
      {isCTA    && <SceneCTA      frame={frame} />}

      {fades.map((f, i) => <FadeToBlack key={i} frame={frame} startAt={f.startAt} duration={f.duration} />)}
    </div>
  );
};
