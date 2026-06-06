import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

// ─── FONT ────────────────────────────────────────────────────────────────────
const fontFace = `
  @font-face {
    font-family: 'Castelforte';
    src: url('${staticFile("fonts/Castelforte.otf")}') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
`;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const GOLD = "#D4A853";
const CREAM = "#FAFAF5";
const DARK = "#0A0A0A";

// Scene boundaries (frames @ 30fps)
// S1:   0 – 150  (5s)
// S2: 150 – 300  (5s)
// S3: 300 – 450  (5s)
// S4: 450 – 600  (5s)
// S5: 600 – 750  (5s)
// Total: 750 frames = 25s

const SCENES = {
  s1: { start: 0,   end: 150 },
  s2: { start: 150, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
  s5: { start: 600, end: 750 },
};

const FADE_DUR = 20;   // fade in/out duration
const FADE_OUT_OFFSET = 25; // frames before scene end to start fade out

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function sceneFade(frame: number, start: number, end: number) {
  const fadeIn = interpolate(frame, [start, start + FADE_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - FADE_OUT_OFFSET, end - FADE_OUT_OFFSET + FADE_DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
}

function elemFade(frame: number, start: number, sceneEnd: number, dur = 18) {
  const fadeIn = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Elem fades out together with scene
  const fadeOut = interpolate(frame, [sceneEnd - FADE_OUT_OFFSET, sceneEnd - FADE_OUT_OFFSET + FADE_DUR], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
}

function slideUp(frame: number, start: number) {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 22, stiffness: 100 } });
  return interpolate(p, [0, 1], [40, 0]);
}

function slideLeft(frame: number, start: number) {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 22, stiffness: 100 } });
  return interpolate(p, [0, 1], [-40, 0]);
}

// ─── PHOTO BG ─────────────────────────────────────────────────────────────────
const PhotoBG: React.FC<{
  src: string;
  frame: number;
  start: number;
  end: number;
  zoom?: "in" | "out";
}> = ({ src, frame, start, end, zoom = "in" }) => {
  const opacity = sceneFade(frame, start, end);
  const dur = end - start;
  const local = frame - start;
  const scale = interpolate(local, [0, dur], zoom === "in" ? [1.07, 1.0] : [1.0, 1.07], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <style>{fontFace}</style>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${scale})`, transformOrigin: "center center",
        }}
      />
      {/* Vignette */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.5) 100%),
          linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.75) 100%)
        `,
      }} />
    </AbsoluteFill>
  );
};

// ─── SCENE 1 — Aerial night ───────────────────────────────────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;

  // Tag: frame 22
  const tagOp = elemFade(frame, start + 22, end);
  const tagX = slideLeft(frame, start + 22);

  // H1: frame 38
  const h1Op = elemFade(frame, start + 38, end);
  const h1Y = slideUp(frame, start + 38);

  // H2: frame 54
  const h2Op = elemFade(frame, start + 54, end);
  const h2Y = slideUp(frame, start + 54);

  // Rating: frame 75
  const ratingOp = elemFade(frame, start + 75, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="aerial-night.jpg" frame={frame} start={start} end={end} zoom="out" />

      {/* TOP TAG */}
      <AbsoluteFill style={{ padding: "70px 60px", justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 1.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 20, letterSpacing: "5px", color: GOLD, textTransform: "uppercase" }}>
            Labin · Istra · Hrvatska
          </span>
        </div>
      </AbsoluteFill>

      {/* CENTER HEADLINE */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px" }}>
        <div style={{
          opacity: h1Op, transform: `translateY(${h1Y}px)`,
          fontFamily: "Castelforte, Georgia, serif", fontSize: 100, color: CREAM,
          lineHeight: 1.0, textShadow: "0 4px 32px rgba(0,0,0,0.7)", letterSpacing: "1px",
        }}>
          Vaš privatni
        </div>
        <div style={{
          opacity: h2Op, transform: `translateY(${h2Y}px)`,
          fontFamily: "Castelforte, Georgia, serif", fontSize: 100, color: GOLD,
          lineHeight: 1.05, textShadow: "0 4px 32px rgba(0,0,0,0.6)", letterSpacing: "1px",
        }}>
          raj u Istri.
        </div>
      </AbsoluteFill>

      {/* BOTTOM RATING */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 80px", opacity: ratingOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            background: GOLD, color: DARK,
            fontFamily: "Castelforte, Georgia, serif", fontSize: 32, fontWeight: 700,
            padding: "12px 20px", borderRadius: 4,
          }}>9.7</div>
          <div>
            <div style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 24, color: CREAM, letterSpacing: "1px" }}>Izuzetan</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#A09070", letterSpacing: "2px" }}>16 recenzija · Booking.com</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Pool ───────────────────────────────────────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;

  const barH = interpolate(frame, [start + 20, start + 55], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = elemFade(frame, start + 22, end);
  const h1Op = elemFade(frame, start + 38, end);
  const h1Y = slideUp(frame, start + 38);
  const h2Op = elemFade(frame, start + 54, end);
  const h2Y = slideUp(frame, start + 54);
  const f1Op = elemFade(frame, start + 72, end);
  const f2Op = elemFade(frame, start + 86, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="pool-olive.jpg" frame={frame} start={start} end={end} zoom="in" />

      <AbsoluteFill style={{ padding: "0 60px", display: "flex", alignItems: "center" }}>
        {/* LEFT ACCENT BAR */}
        <div style={{ width: 3, height: barH, background: GOLD, borderRadius: 2, marginRight: 36, flexShrink: 0, opacity: elemFade(frame, start + 20, end) }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ opacity: tagOp, fontFamily: "Castelforte, Georgia, serif", fontSize: 17, letterSpacing: "5px", color: CREAM, textTransform: "uppercase", marginBottom: 22, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            Privatni bazen
          </div>
          <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 104, color: CREAM, lineHeight: 0.95, textShadow: "0 4px 28px rgba(0,0,0,0.8)" }}>
            Samo
          </div>
          <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 104, color: CREAM, lineHeight: 0.95, textShadow: "0 4px 28px rgba(0,0,0,0.7)", marginBottom: 44 }}>
            za vas.
          </div>

          {[
            { text: "Morska voda · Grijani bazen", op: f1Op },
            { text: "Ležaljke · Suncobrani · Mir", op: f2Op },
          ].map((f) => (
            <div key={f.text} style={{ opacity: f.op, display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
              <span style={{ fontFamily: "Georgia, serif", fontSize: 26, color: CREAM, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
                {f.text}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — Living room ────────────────────────────────────────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;

  const tagOp = elemFade(frame, start + 20, end);
  const h1Op = elemFade(frame, start + 36, end);
  const h1Y = slideUp(frame, start + 36);
  const subOp = elemFade(frame, start + 56, end);
  const p1Op = elemFade(frame, start + 72, end);
  const p2Op = elemFade(frame, start + 84, end);
  const p3Op = elemFade(frame, start + 96, end);

  const pills = [
    { label: "2 spavaće sobe", op: p1Op },
    { label: "Do 5 gostiju", op: p2Op },
    { label: "Kamin · AC · WiFi", op: p3Op },
  ];

  return (
    <AbsoluteFill>
      <PhotoBG src="living-room.jpg" frame={frame} start={start} end={end} zoom="out" />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px" }}>
        <div style={{ opacity: tagOp, fontFamily: "Castelforte, Georgia, serif", fontSize: 17, letterSpacing: "5px", color: GOLD, textTransform: "uppercase", marginBottom: 20, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
          Interijer
        </div>
        <div style={{
          opacity: h1Op, transform: `translateY(${h1Y}px)`,
          fontFamily: "Castelforte, Georgia, serif", fontSize: 90, color: CREAM,
          lineHeight: 1.05, textShadow: "0 4px 28px rgba(0,0,0,0.9)", marginBottom: 20,
        }}>
          Osjećaj doma,<br />
          <span style={{ color: GOLD }}>daleko od njega.</span>
        </div>
        <div style={{ opacity: subOp, fontFamily: "Georgia, serif", fontSize: 24, color: "rgba(250,250,245,0.85)", marginBottom: 30, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          Cijela vila — samo vaša
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {pills.map((p) => (
            <div key={p.label} style={{
              opacity: p.op,
              border: "1px solid rgba(212,168,83,0.7)", borderRadius: 40,
              padding: "10px 24px",
              fontFamily: "Georgia, serif", fontSize: 20, color: GOLD,
              background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
            }}>
              {p.label}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — BBQ Terrace ────────────────────────────────────────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s4;

  const tagOp = elemFade(frame, start + 20, end);
  const tagX = slideLeft(frame, start + 20);
  const h1Op = elemFade(frame, start + 36, end);
  const h1Y = slideUp(frame, start + 36);
  const subOp = elemFade(frame, start + 56, end);
  const quoteOp = elemFade(frame, start + 78, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="bbq-terrace.jpg" frame={frame} start={start} end={end} zoom="in" />

      {/* TOP */}
      <AbsoluteFill style={{ padding: "70px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 32, height: 1.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 17, letterSpacing: "5px", color: GOLD, textTransform: "uppercase" }}>
            Vanjska terasa
          </span>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 96, color: CREAM, lineHeight: 1.0, textShadow: "0 4px 28px rgba(0,0,0,0.7)" }}>
          Večere koje<br />
          <span style={{ color: GOLD }}>pamtite.</span>
        </div>
        <div style={{ opacity: subOp, marginTop: 24, fontFamily: "Georgia, serif", fontSize: 24, color: "rgba(250,250,245,0.85)", lineHeight: 1.6, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          Roštilj · Vanjska blagovaonica<br />
          Vrt · Istarska noć
        </div>
      </AbsoluteFill>

      {/* BOTTOM QUOTE */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 80px", opacity: quoteOp }}>
        <div style={{ borderLeft: "3px solid " + GOLD, paddingLeft: 24 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "rgba(250,250,245,0.9)", fontStyle: "italic", lineHeight: 1.5, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            „Toplo preporučujemo svima koji žele<br />miran i ugodan odmor."
          </div>
          <div style={{ marginTop: 12, fontFamily: "Georgia, serif", fontSize: 16, color: GOLD, letterSpacing: "2px" }}>
            — Ante ★★★★★
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Facade night / CTA ─────────────────────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;

  const logoOp = elemFade(frame, start + 18, end);
  const h1Op = elemFade(frame, start + 34, end);
  const h1Y = slideUp(frame, start + 34);
  const h2Op = elemFade(frame, start + 52, end);
  const h2Y = slideUp(frame, start + 52);
  const ctaOp = elemFade(frame, start + 70, end);
  const ctaScale = interpolate(
    spring({ frame: frame - (start + 70), fps: 30, config: { damping: 16, stiffness: 100 } }),
    [0, 1], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const local = frame - start;
  const pulse = 1 + interpolate(Math.sin((local / 30) * Math.PI), [-1, 1], [-0.015, 0.015]);

  return (
    <AbsoluteFill>
      <PhotoBG src="facade-night.jpg" frame={frame} start={start} end={end} zoom="out" />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
        <div style={{ opacity: logoOp, marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 64, height: 1.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 18, letterSpacing: "7px", color: GOLD, textTransform: "uppercase" }}>
            Krasna kuća Istra
          </span>
          <div style={{ width: 64, height: 1.5, background: GOLD }} />
        </div>

        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 96, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 32px rgba(0,0,0,0.7)" }}>
          Vaše ljeto
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 96, color: GOLD, lineHeight: 1.05, textShadow: "0 6px 32px rgba(0,0,0,0.6)", marginBottom: 56 }}>
          počinje ovdje.
        </div>

        <div style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale * pulse})`,
          background: GOLD, color: DARK,
          fontFamily: "Castelforte, Georgia, serif", fontSize: 24,
          padding: "22px 56px", borderRadius: 4,
          letterSpacing: "3px", textTransform: "uppercase",
        }}>
          Rezervirajte · Booking.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export const KrasnaKucaV1: React.FC = () => {
  const frame = useCurrentFrame();

  const musicVol = interpolate(
    frame,
    [0, 30, 720, 750],
    [0, 0.78, 0.78, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Whoosh exactly at scene transition start
  const whooshFrames = [SCENES.s2.start, SCENES.s3.start, SCENES.s4.start, SCENES.s5.start];

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <style>{fontFace}</style>

      <Audio src={staticFile("In alto mare (2022 Remastered).mp3")} startFrom={52 * 30} volume={musicVol} />

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
