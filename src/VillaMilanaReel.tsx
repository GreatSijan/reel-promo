import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

// ─── FONT ─────────────────────────────────────────────────────────────────────
const fontFace = `
  @font-face {
    font-family: 'Castelforte';
    src: url('${staticFile("fonts/Castelforte.otf")}') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const CREAM = "#FAFAF5";
const DARK = "#0A0A0A";
const BLUE = "#7BB8D4"; // Jadransko more

// Scene timing: 5 scena × 150 frejmova = 750f = 25s @ 30fps
const SCENES = {
  s1: { start: 0,   end: 150 }, // terasa-more-predvecer → HOOK
  s2: { start: 150, end: 300 }, // stol-za-veceru-predvecer → večere uz more
  s3: { start: 300, end: 450 }, // stepenice-prema-vili → dolazak u vilu
  s4: { start: 450, end: 600 }, // prikaz-sobe-i-pogled-na-more → interijer
  s5: { start: 600, end: 750 }, // pogled-na-vilu-dron → CTA
};

const FADE = 20;
const FADE_OUT_AT = 25; // frejmova prije kraja scene

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function sceneOpacity(frame: number, start: number, end: number) {
  const i = interpolate(frame, [start, start + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [end - FADE_OUT_AT, end - FADE_OUT_AT + FADE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

function elemOp(frame: number, elemStart: number, sceneEnd: number, dur = 18) {
  const i = interpolate(frame, [elemStart, elemStart + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [sceneEnd - FADE_OUT_AT, sceneEnd - FADE_OUT_AT + FADE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

function sUp(frame: number, start: number) {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 22, stiffness: 100 } });
  return interpolate(p, [0, 1], [45, 0]);
}

function sLeft(frame: number, start: number) {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 22, stiffness: 100 } });
  return interpolate(p, [0, 1], [-45, 0]);
}

function sRight(frame: number, start: number) {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 22, stiffness: 100 } });
  return interpolate(p, [0, 1], [45, 0]);
}

// ─── PHOTO BG ─────────────────────────────────────────────────────────────────
const PhotoBG: React.FC<{
  src: string; frame: number; start: number; end: number;
  zoom?: "in" | "out"; overlayType?: "bottom" | "top" | "left" | "vignette";
}> = ({ src, frame, start, end, zoom = "in", overlayType = "bottom" }) => {
  const opacity = sceneOpacity(frame, start, end);
  const local = frame - start;
  const dur = end - start;
  const scale = interpolate(local, [0, dur], zoom === "in" ? [1.07, 1.0] : [1.0, 1.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const overlays: Record<string, string> = {
    bottom: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.75) 100%)",
    top: "linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 35%, rgba(0,0,0,0.65) 100%)",
    left: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
    vignette: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)",
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "center center" }}
      />
      <AbsoluteFill style={{ background: overlays[overlayType] }} />
    </AbsoluteFill>
  );
};

// ─── SCENE 1 — Terasa s kaučem u suton (HOOK) ─────────────────────────────────
// Tamno nebo desno gore, kameni zid lijevo = tekst ide gore desno i sredina
// Foto: pogled-na-terasu-i-more-predvecer.jpg
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;

  // Tag gore — slide iz lijeva
  const tagOp = elemOp(frame, start + 20, end);
  const tagX = sLeft(frame, start + 20);

  // H1 sredina — slide gore
  const h1Op = elemOp(frame, start + 36, end);
  const h1Y = sUp(frame, start + 36);

  // H2 sredina — slide gore, zlatno
  const h2Op = elemOp(frame, start + 52, end);
  const h2Y = sUp(frame, start + 52);

  // Rating dno lijevo
  const ratingOp = elemOp(frame, start + 74, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-terasu-i-more-predvecer.jpg" frame={frame} start={start} end={end} zoom="out" overlayType="vignette" />

      {/* TAG GORE */}
      <AbsoluteFill style={{ padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 48, height: 2, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 26, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            Rijeka · Hrvatska
          </span>
        </div>
      </AbsoluteFill>

      {/* HEADLINE SREDINA */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px" }}>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 124, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 40px rgba(0,0,0,0.85)", letterSpacing: "1px" }}>
          Život uz more.
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 124, color: GOLD, lineHeight: 1.05, textShadow: "0 6px 40px rgba(0,0,0,0.7)", letterSpacing: "1px" }}>
          Samo vaš.
        </div>
      </AbsoluteFill>

      {/* RATING DNO LIJEVO */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 88px", opacity: ratingOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: GOLD, color: DARK, fontFamily: "Castelforte, Georgia, serif", fontSize: 40, fontWeight: 700, padding: "14px 22px", borderRadius: 6 }}>
            10
          </div>
          <div>
            <div style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 30, color: CREAM, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Izuzetan</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#B0A080", letterSpacing: "2px", marginTop: 4 }}>3 recenzije · Booking.com</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Stol za večeru u suton ─────────────────────────────────────────
// Tamno lijevo (zelenilo) i tamno nebo gore desno = tekst gore lijevo
// Foto: stol-za-veceru-predvecer.jpg
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;

  const tagOp = elemOp(frame, start + 20, end);
  const tagX = sLeft(frame, start + 20);
  const h1Op = elemOp(frame, start + 36, end);
  const h1Y = sUp(frame, start + 36);
  const h2Op = elemOp(frame, start + 52, end);
  const h2Y = sUp(frame, start + 52);
  const subOp = elemOp(frame, start + 70, end);
  const quoteOp = elemOp(frame, start + 88, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="stol-za-veceru-predvecer.jpg" frame={frame} start={start} end={end} zoom="in" overlayType="left" />

      {/* GORE LIJEVO */}
      <AbsoluteFill style={{ padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 44, height: 2, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 24, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
            Večera uz more
          </span>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 114, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 36px rgba(0,0,0,0.85)" }}>
          Večere koje
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 114, color: GOLD, lineHeight: 1.05, textShadow: "0 6px 36px rgba(0,0,0,0.7)", marginBottom: 28 }}>
          ostaju u sjećanju.
        </div>
        <div style={{ opacity: subOp, fontFamily: "Georgia, serif", fontSize: 30, color: "rgba(250,250,245,0.9)", lineHeight: 1.6, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Restoran · Terasa uz more · Doručak
        </div>
      </AbsoluteFill>

      {/* CITAT DNO */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 88px", opacity: quoteOp }}>
        <div style={{ borderLeft: "4px solid " + GOLD, paddingLeft: 26 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "rgba(250,250,245,0.92)", fontStyle: "italic", lineHeight: 1.6, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            „Couldn't have asked for a better experience."
          </div>
          <div style={{ marginTop: 12, fontFamily: "Georgia, serif", fontSize: 20, color: GOLD, letterSpacing: "2px" }}>
            — Sabbag ★★★★★
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — Stepenice prema vili noću ──────────────────────────────────────
// Tamno nebo gore lijevo i desno, toplo osvjetljenje stepenica
// Tekst gore — nebo je tamno i čisto
// Foto: stepenice-prema-vili.jpg
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;

  const lineW = interpolate(frame, [start + 18, start + 55], [0, 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = elemOp(frame, start + 20, end);
  const h1Op = elemOp(frame, start + 36, end);
  const h1Y = sUp(frame, start + 36);
  const h2Op = elemOp(frame, start + 52, end);
  const h2Y = sUp(frame, start + 52);
  const f1Op = elemOp(frame, start + 70, end);
  const f2Op = elemOp(frame, start + 84, end);
  const f3Op = elemOp(frame, start + 98, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="stepenice-prema-vili.jpg" frame={frame} start={start} end={end} zoom="out" overlayType="top" />

      {/* GORE — tamno nebo */}
      <AbsoluteFill style={{ padding: "68px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, marginBottom: 26 }}>
          <div style={{ width: lineW, height: 2, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 24, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Vila uz more
          </span>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 110, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 36px rgba(0,0,0,0.85)" }}>
          Dobrodošli
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 110, color: GOLD, lineHeight: 1.05, textShadow: "0 6px 36px rgba(0,0,0,0.7)", marginBottom: 36 }}>
          u vaš raj.
        </div>
      </AbsoluteFill>

      {/* DNO — sadržaji */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px" }}>
        {[
          { text: "Privatna plaža · Direktan pristup moru", op: f1Op },
          { text: "Bazen · Sauna · Fitness centar", op: f2Op },
          { text: "280 m² · 5 soba · Do 12 gostiju", op: f3Op },
        ].map((f) => (
          <div key={f.text} style={{ opacity: f.op, display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
            <span style={{ fontFamily: "Georgia, serif", fontSize: 30, color: CREAM, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
              {f.text}
            </span>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — Soba s pogledom na more ────────────────────────────────────────
// Cijela soba je bijela/svijetla — tekst ide NA DNO s jakim dark overlayem
// Jedino tamno: tamni pod i prozor s morem
// Foto: prikaz-sobe-i-pogled-na-more.jpg
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s4;

  const tagOp = elemOp(frame, start + 20, end);
  const h1Op = elemOp(frame, start + 36, end);
  const h1Y = sUp(frame, start + 36);
  const subOp = elemOp(frame, start + 56, end);
  const p1Op = elemOp(frame, start + 72, end);
  const p2Op = elemOp(frame, start + 86, end);
  const p3Op = elemOp(frame, start + 100, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="prikaz-sobe-i-pogled-na-more.jpg" frame={frame} start={start} end={end} zoom="in" overlayType="bottom" />

      {/* Dodatni tamni overlay na dnu jer je soba previše bijela */}
      <AbsoluteFill style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 35%, transparent 60%)",
        opacity: sceneOpacity(frame, start, end),
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px" }}>
        <div style={{ opacity: tagOp, fontFamily: "Castelforte, Georgia, serif", fontSize: 24, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", marginBottom: 22, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
          Interijer
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 108, color: CREAM, lineHeight: 1.05, textShadow: "0 6px 36px rgba(0,0,0,0.95)", marginBottom: 22 }}>
          Svaka soba —<br />
          <span style={{ color: GOLD }}>pogled na more.</span>
        </div>
        <div style={{ opacity: subOp, fontFamily: "Georgia, serif", fontSize: 28, color: "rgba(250,250,245,0.88)", marginBottom: 30, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Cijela vila samo vaša
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { label: "5 spavaćih soba", op: p1Op },
            { label: "5 kupaonica", op: p2Op },
            { label: "Klima · WiFi · TV", op: p3Op },
          ].map((p) => (
            <div key={p.label} style={{ opacity: p.op, border: "2px solid rgba(201,168,76,0.75)", borderRadius: 40, padding: "13px 28px", fontFamily: "Georgia, serif", fontSize: 24, color: GOLD, background: "rgba(0,0,0,0.45)" }}>
              {p.label}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Dron shot vile (CTA) ───────────────────────────────────────────
// Cijela slika je zelena/svjetla — tekst u centar s jakim shadowom + dark overlay
// Foto: pogled-na-vilu-dron.jpg
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;

  const logoOp = elemOp(frame, start + 18, end);
  const h1Op = elemOp(frame, start + 34, end);
  const h1Y = sUp(frame, start + 34);
  const h2Op = elemOp(frame, start + 52, end);
  const h2Y = sUp(frame, start + 52);
  const ctaOp = elemOp(frame, start + 70, end);
  const ctaScale = interpolate(
    spring({ frame: frame - (start + 70), fps: 30, config: { damping: 16, stiffness: 100 } }),
    [0, 1], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const local = frame - start;
  const pulse = 1 + interpolate(Math.sin((local / 30) * Math.PI), [-1, 1], [-0.015, 0.015]);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-vilu-dron.jpg" frame={frame} start={start} end={end} zoom="out" overlayType="vignette" />

      {/* Dodatni centralni overlay jer je slika previše zelena/svjetla */}
      <AbsoluteFill style={{
        background: "rgba(0,0,0,0.42)",
        opacity: sceneOpacity(frame, start, end),
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
        <div style={{ opacity: logoOp, marginBottom: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 80, height: 2, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 26, letterSpacing: "8px", color: GOLD, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Villa Milana Relax
          </span>
          <div style={{ width: 80, height: 2, background: GOLD }} />
        </div>

        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 122, color: CREAM, lineHeight: 1.0, textShadow: "0 8px 44px rgba(0,0,0,0.95)" }}>
          Vaše ljeto
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 122, color: GOLD, lineHeight: 1.05, textShadow: "0 8px 44px rgba(0,0,0,0.85)", marginBottom: 60 }}>
          počinje ovdje.
        </div>

        <div style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale * pulse})`,
          background: GOLD, color: DARK,
          fontFamily: "Castelforte, Georgia, serif", fontSize: 28,
          padding: "24px 60px", borderRadius: 6,
          letterSpacing: "4px", textTransform: "uppercase",
          textShadow: "none",
        }}>
          Rezervirajte · Booking.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export const VillaMilanaReel: React.FC = () => {
  const frame = useCurrentFrame();

  const musicVol = interpolate(
    frame,
    [0, 30, 720, 750],
    [0, 0.78, 0.78, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const whooshFrames = [SCENES.s2.start, SCENES.s3.start, SCENES.s4.start, SCENES.s5.start];

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <style>{fontFace}</style>

      <Audio
        src={staticFile("In alto mare (2022 Remastered).mp3")}
        startFrom={52 * 30}
        volume={musicVol}
      />

      {whooshFrames.map((wf) =>
        frame >= wf && frame < wf + 20 ? (
          <Audio key={wf} src={staticFile("woosh-cinematic.mp3")} startFrom={0} endAt={20} volume={0.22} />
        ) : null
      )}

      {frame < SCENES.s2.start && <Scene1 frame={frame} />}
      {frame >= SCENES.s2.start - 1 && frame < SCENES.s3.start && <Scene2 frame={frame} />}
      {frame >= SCENES.s3.start - 1 && frame < SCENES.s4.start && <Scene3 frame={frame} />}
      {frame >= SCENES.s4.start - 1 && frame < SCENES.s5.start && <Scene4 frame={frame} />}
      {frame >= SCENES.s5.start - 1 && <Scene5 frame={frame} />}
    </AbsoluteFill>
  );
};
