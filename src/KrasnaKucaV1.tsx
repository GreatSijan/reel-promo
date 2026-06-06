import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

const fontFace = `
  @font-face {
    font-family: 'Castelforte';
    src: url('${staticFile("fonts/Castelforte.otf")}') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
`;

const GOLD = "#D4A853";
const CREAM = "#FAFAF5";
const DARK = "#0A0A0A";

const SCENES = {
  s1: { start: 0,   end: 150 },
  s2: { start: 150, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
  s5: { start: 600, end: 750 },
};

const FADE_DUR = 20;
const FADE_OUT_OFFSET = 25;

function sceneFade(frame: number, start: number, end: number) {
  const fadeIn = interpolate(frame, [start, start + FADE_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [end - FADE_OUT_OFFSET, end - FADE_OUT_OFFSET + FADE_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(fadeIn, fadeOut);
}

function elemFade(frame: number, start: number, sceneEnd: number, dur = 18) {
  const fadeIn = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [sceneEnd - FADE_OUT_OFFSET, sceneEnd - FADE_OUT_OFFSET + FADE_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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

const PhotoBG: React.FC<{ src: string; frame: number; start: number; end: number; zoom?: "in" | "out" }> = ({ src, frame, start, end, zoom = "in" }) => {
  const opacity = sceneFade(frame, start, end);
  const dur = end - start;
  const local = frame - start;
  const scale = interpolate(local, [0, dur], zoom === "in" ? [1.07, 1.0] : [1.0, 1.07], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <style>{fontFace}</style>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "center center" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.5) 100%), linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.8) 100%)` }} />
    </AbsoluteFill>
  );
};

// ─── SCENE 1 ──────────────────────────────────────────────────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;
  const tagOp = elemFade(frame, start + 22, end);
  const tagX = slideLeft(frame, start + 22);
  const h1Op = elemFade(frame, start + 38, end);
  const h1Y = slideUp(frame, start + 38);
  const h2Op = elemFade(frame, start + 54, end);
  const h2Y = slideUp(frame, start + 54);
  const ratingOp = elemFade(frame, start + 75, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="aerial-night.jpg" frame={frame} start={start} end={end} zoom="out" />

      {/* TOP TAG */}
      <AbsoluteFill style={{ padding: "72px 60px", justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 52, height: 2.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 28, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            Labin · Istra · Hrvatska
          </span>
        </div>
      </AbsoluteFill>

      {/* CENTER HEADLINE */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px" }}>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 130, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 40px rgba(0,0,0,0.8)", letterSpacing: "1px" }}>
          Vaš privatni
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 130, color: GOLD, lineHeight: 1.05, textShadow: "0 0 60px rgba(0,0,0,1), 0 6px 40px rgba(0,0,0,0.95), 0 2px 0px rgba(0,0,0,0.9)", letterSpacing: "1px", WebkitTextStroke: "0.5px rgba(255,220,120,0.4)" }}>
          raj u Istri.
        </div>
      </AbsoluteFill>

      {/* BOTTOM RATING */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px", opacity: ratingOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ background: GOLD, color: DARK, fontFamily: "Castelforte, Georgia, serif", fontSize: 42, fontWeight: 700, padding: "16px 24px", borderRadius: 6 }}>
            9.7
          </div>
          <div>
            <div style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 32, color: CREAM, letterSpacing: "1px", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Izuzetan</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#B0A080", letterSpacing: "2px", marginTop: 4 }}>16 recenzija · Booking.com</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 ──────────────────────────────────────────────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;
  const tagOp = elemFade(frame, start + 22, end);
  const h1Op = elemFade(frame, start + 38, end);
  const h1Y = slideUp(frame, start + 38);
  const h2Op = elemFade(frame, start + 54, end);
  const h2Y = slideUp(frame, start + 54);
  const f1Op = elemFade(frame, start + 72, end);
  const f2Op = elemFade(frame, start + 88, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="pool-olive.jpg" frame={frame} start={start} end={end} zoom="in" />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ opacity: tagOp, fontFamily: "Castelforte, Georgia, serif", fontSize: 30, letterSpacing: "6px", color: CREAM, textTransform: "uppercase", marginBottom: 30, textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8)" }}>
            Privatni bazen
          </div>
          <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 148, color: CREAM, lineHeight: 0.92, textShadow: "0 6px 50px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.7)" }}>
            Samo
          </div>
          <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 148, color: GOLD, lineHeight: 0.92, textShadow: "0 6px 50px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.7)", marginBottom: 56 }}>
            za vas.
          </div>
          {[
            { text: "Morska voda · Grijani bazen", op: f1Op },
            { text: "Ležaljke · Suncobrani · Mir", op: f2Op },
          ].map((f) => (
            <div key={f.text} style={{ opacity: f.op, fontFamily: "Georgia, serif", fontSize: 34, color: CREAM, textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.7)", marginBottom: 16, letterSpacing: "1px" }}>
              {f.text}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 ──────────────────────────────────────────────────────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;
  const tagOp = elemFade(frame, start + 20, end);
  const h1Op = elemFade(frame, start + 36, end);
  const h1Y = slideUp(frame, start + 36);
  const subOp = elemFade(frame, start + 56, end);
  const p1Op = elemFade(frame, start + 72, end);
  const p2Op = elemFade(frame, start + 86, end);
  const p3Op = elemFade(frame, start + 100, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="living-room.jpg" frame={frame} start={start} end={end} zoom="out" />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px" }}>
        <div style={{ opacity: tagOp, fontFamily: "Castelforte, Georgia, serif", fontSize: 24, letterSpacing: "6px", color: GOLD, textTransform: "uppercase", marginBottom: 22, textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
          Interijer
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 108, color: CREAM, lineHeight: 1.05, textShadow: "0 6px 36px rgba(0,0,0,0.95)", marginBottom: 22 }}>
          Osjećaj doma,<br />
          <span style={{ color: GOLD }}>daleko od njega.</span>
        </div>
        <div style={{ opacity: subOp, fontFamily: "Georgia, serif", fontSize: 30, color: "rgba(250,250,245,0.9)", marginBottom: 34, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Cijela vila — samo vaša
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "2 spavaće sobe", op: p1Op },
            { label: "Do 5 gostiju", op: p2Op },
            { label: "Kamin · AC · WiFi", op: p3Op },
          ].map((p) => (
            <div key={p.label} style={{ opacity: p.op, border: "2px solid rgba(212,168,83,0.8)", borderRadius: 40, padding: "14px 30px", fontFamily: "Georgia, serif", fontSize: 24, color: GOLD, background: "rgba(0,0,0,0.4)" }}>
              {p.label}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 ──────────────────────────────────────────────────────────────────
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
      <AbsoluteFill style={{ padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
          <div style={{ width: 44, height: 2.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 24, letterSpacing: "6px", color: GOLD, textTransform: "uppercase" }}>Vanjska terasa</span>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 112, color: CREAM, lineHeight: 1.0, textShadow: "0 6px 36px rgba(0,0,0,0.75)" }}>
          Večere koje<br /><span style={{ color: GOLD }}>pamtite.</span>
        </div>
        <div style={{ opacity: subOp, marginTop: 28, fontFamily: "Georgia, serif", fontSize: 30, color: "rgba(250,250,245,0.9)", lineHeight: 1.6, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>
          Roštilj · Vanjska blagovaonica<br />Vrt · Istarska noć
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px", opacity: quoteOp }}>
        <div style={{ borderLeft: "5px solid " + GOLD, paddingLeft: 34 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 34, color: "rgba(250,250,245,0.97)", fontStyle: "italic", lineHeight: 1.6, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            „Toplo preporučujemo svima koji žele<br />miran i ugodan odmor."
          </div>
          <div style={{ marginTop: 18, fontFamily: "Georgia, serif", fontSize: 28, color: GOLD, letterSpacing: "2px", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
            — Ante ★★★★★
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 ──────────────────────────────────────────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;
  const logoOp = elemFade(frame, start + 18, end);
  const h1Op = elemFade(frame, start + 34, end);
  const h1Y = slideUp(frame, start + 34);
  const h2Op = elemFade(frame, start + 52, end);
  const h2Y = slideUp(frame, start + 52);
  const ctaOp = elemFade(frame, start + 70, end);
  const ctaScale = interpolate(spring({ frame: frame - (start + 70), fps: 30, config: { damping: 16, stiffness: 100 } }), [0, 1], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const local = frame - start;
  const pulse = 1 + interpolate(Math.sin((local / 30) * Math.PI), [-1, 1], [-0.015, 0.015]);

  return (
    <AbsoluteFill>
      <PhotoBG src="facade-night.jpg" frame={frame} start={start} end={end} zoom="out" />

      {/* NAZIV - GORE gdje je nebo */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "80px 60px 0", textAlign: "center" }}>
        <div style={{ opacity: logoOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 100, height: 2.5, background: GOLD }} />
          <span style={{ fontFamily: "Castelforte, Georgia, serif", fontSize: 48, letterSpacing: "10px", color: GOLD, textTransform: "uppercase", textShadow: "0 4px 30px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.8)" }}>
            Krasna kuća Istra
          </span>
          <div style={{ width: 100, height: 2.5, background: GOLD }} />
        </div>
      </AbsoluteFill>

      {/* HEADLINE - CENTAR */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 128, color: CREAM, lineHeight: 1.0, textShadow: "0 8px 40px rgba(0,0,0,0.8)" }}>
          Vaše ljeto
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Castelforte, Georgia, serif", fontSize: 128, color: GOLD, lineHeight: 1.05, textShadow: "0 8px 40px rgba(0,0,0,0.7)", marginBottom: 60 }}>
          počinje ovdje.
        </div>
        <div style={{ opacity: ctaOp, transform: `scale(${ctaScale * pulse})`, background: GOLD, color: DARK, fontFamily: "Castelforte, Georgia, serif", fontSize: 30, padding: "26px 64px", borderRadius: 6, letterSpacing: "4px", textTransform: "uppercase" }}>
          Rezervirajte · Booking.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export const KrasnaKucaV1: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = interpolate(frame, [0, 30, 720, 750], [0, 0.78, 0.78, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
