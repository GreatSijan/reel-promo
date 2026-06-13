import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

// ─── FONT: Cormorant Garamond (Google Fonts) ──────────────────────────────────
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

// ─── PALETA — mediteranska luksuznost ────────────────────────────────────────
const TEAL     = "#4E9DA8";   // Jadransko more
const SAND     = "#C8B89A";   // Obalna bež
const STONE    = "#F0EAE0";   // Kamena bijela
const DEEP     = "#0D1B1E";   // Tamno more (background)
const WHITE    = "#FFFFFF";

// ─── TIMING ───────────────────────────────────────────────────────────────────
const SCENES = {
  s1: { start: 0,   end: 150 },
  s2: { start: 150, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
  s5: { start: 600, end: 750 },
};
const FADE = 22;
const OUT_AT = 28;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function sceneFade(frame: number, start: number, end: number) {
  const i = interpolate(frame, [start, start + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [end - OUT_AT, end - OUT_AT + FADE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

function elemFade(frame: number, elemStart: number, sceneEnd: number, dur = 20) {
  const i = interpolate(frame, [elemStart, elemStart + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [sceneEnd - OUT_AT, sceneEnd - OUT_AT + FADE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

// Horizontal reveal — tekst se otkriva s lijeva na desno (clipPath)
function revealClip(frame: number, start: number, dur = 28): string {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 28, stiffness: 80 } });
  const pct = interpolate(p, [0, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return `inset(0 ${100 - pct}% 0 0)`;
}

// Fade + blagi drift gore (elegantniji od spring-a)
function driftUp(frame: number, start: number): number {
  const p = interpolate(frame, [start, start + 35], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return p;
}

// ─── FOTO POZADINA ────────────────────────────────────────────────────────────
const PhotoBG: React.FC<{
  src: string; frame: number; start: number; end: number;
  zoom?: "in" | "out";
  overlay?: string;
}> = ({ src, frame, start, end, zoom = "in", overlay }) => {
  const opacity = sceneFade(frame, start, end);
  const local = frame - start;
  const dur = end - start;
  const scale = interpolate(local, [0, dur], zoom === "in" ? [1.06, 1.0] : [1.0, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const defaultOverlay = "linear-gradient(to bottom, rgba(13,27,30,0.3) 0%, transparent 30%, transparent 55%, rgba(13,27,30,0.82) 100%)";

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "center center" }}
      />
      <AbsoluteFill style={{ background: overlay ?? defaultOverlay }} />
    </AbsoluteFill>
  );
};

// Tanka dekorativna linija s reveal animacijom
const RevealLine: React.FC<{ frame: number; start: number; color?: string; width?: number }> = ({ frame, start, color = TEAL, width = 60 }) => {
  const w = interpolate(frame, [start, start + 30], [0, width], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ width: w, height: 1.5, background: color, marginBottom: 16 }} />;
};

// ─── SCENE 1 — Terasa u suton (HOOK) ─────────────────────────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;

  const tagOp   = elemFade(frame, start + 18, end);
  const h1Clip  = revealClip(frame, start + 32);
  const h1Op    = elemFade(frame, start + 32, end);
  const h2Clip  = revealClip(frame, start + 52);
  const h2Op    = elemFade(frame, start + 52, end);
  const subOp   = elemFade(frame, start + 68, end);
  const subY    = driftUp(frame, start + 68);
  const ratOp   = elemFade(frame, start + 86, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-terasu-i-more-predvecer.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="radial-gradient(ellipse at center, transparent 20%, rgba(13,27,30,0.55) 100%), linear-gradient(to bottom, rgba(13,27,30,0.4) 0%, transparent 28%, transparent 52%, rgba(13,27,30,0.85) 100%)" />

      {/* TAG GORE — fade in */}
      <AbsoluteFill style={{ padding: "76px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, display: "flex", alignItems: "center", gap: 16 }}>
          <RevealLine frame={frame} start={start + 18} color={TEAL} width={44} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 24, letterSpacing: "8px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
            Rijeka · Hrvatska
          </span>
        </div>
      </AbsoluteFill>

      {/* HEADLINE CENTAR — horizontal reveal */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 136, color: STONE, lineHeight: 0.95, textShadow: "0 8px 50px rgba(13,27,30,0.9)", letterSpacing: "-1px" }}>
          Život uz more.
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: "italic", fontSize: 136, color: TEAL, lineHeight: 1.0, textShadow: "0 8px 50px rgba(13,27,30,0.85)", letterSpacing: "-1px", marginTop: 8 }}>
          Samo vaš.
        </div>
      </AbsoluteFill>

      {/* SUB + RATING DNO */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 92px" }}>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, color: SAND, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 28, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Villa Milana Relax
        </div>
        <div style={{ opacity: ratOp, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: TEAL, color: WHITE, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 38, padding: "12px 20px", borderRadius: 4, letterSpacing: "1px" }}>
            10.0
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 28, color: STONE, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Izuzetan</div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 20, color: SAND, letterSpacing: "2px", marginTop: 4 }}>3 recenzije · Booking.com</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Stol za večeru u suton ────────────────────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;

  const tagOp   = elemFade(frame, start + 18, end);
  const h1Clip  = revealClip(frame, start + 32);
  const h1Op    = elemFade(frame, start + 32, end);
  const h2Clip  = revealClip(frame, start + 50);
  const h2Op    = elemFade(frame, start + 50, end);
  const subOp   = elemFade(frame, start + 66, end);
  const subY    = driftUp(frame, start + 66);
  const qOp     = elemFade(frame, start + 86, end);
  const qY      = driftUp(frame, start + 86);

  return (
    <AbsoluteFill>
      <PhotoBG src="stol-za-veceru-predvecer.jpg" frame={frame} start={start} end={end} zoom="in"
        overlay="linear-gradient(to right, rgba(13,27,30,0.72) 0%, rgba(13,27,30,0.3) 55%, transparent 100%)" />

      {/* GORE LIJEVO */}
      <AbsoluteFill style={{ padding: "76px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp }}>
          <RevealLine frame={frame} start={start + 18} color={TEAL} width={52} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "8px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Večera uz more
          </span>
        </div>
        <div style={{ marginTop: 40, opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 120, color: STONE, lineHeight: 0.95, textShadow: "0 6px 44px rgba(13,27,30,0.95)" }}>
          Večere koje
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: "italic", fontSize: 120, color: TEAL, lineHeight: 1.0, textShadow: "0 6px 44px rgba(13,27,30,0.85)", marginBottom: 32 }}>
          ostaju u sjećanju.
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, color: "rgba(240,234,224,0.88)", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>
          Restoran · Terasa uz more · Doručak
        </div>
      </AbsoluteFill>

      {/* CITAT DNO */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 92px", opacity: qOp }}>
        <div style={{ transform: `translateY(${qY}px)`, borderLeft: "2px solid " + TEAL, paddingLeft: 28 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontStyle: "italic", fontSize: 30, color: "rgba(240,234,224,0.93)", lineHeight: 1.65, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            „Couldn't have asked for a better experience."
          </div>
          <div style={{ marginTop: 14, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 22, color: TEAL, letterSpacing: "3px" }}>
            — Sabbag ★★★★★
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — Stepenice prema vili noću ─────────────────────────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;

  const tagOp  = elemFade(frame, start + 18, end);
  const h1Clip = revealClip(frame, start + 32);
  const h1Op   = elemFade(frame, start + 32, end);
  const h2Clip = revealClip(frame, start + 50);
  const h2Op   = elemFade(frame, start + 50, end);
  const f1Op   = elemFade(frame, start + 68, end);
  const f1Y    = driftUp(frame, start + 68);
  const f2Op   = elemFade(frame, start + 82, end);
  const f2Y    = driftUp(frame, start + 82);
  const f3Op   = elemFade(frame, start + 96, end);
  const f3Y    = driftUp(frame, start + 96);

  return (
    <AbsoluteFill>
      <PhotoBG src="stepenice-prema-vili.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.65) 0%, rgba(13,27,30,0.15) 35%, transparent 55%, rgba(13,27,30,0.80) 100%)" />

      {/* GORE — tamno nebo */}
      <AbsoluteFill style={{ padding: "76px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp }}>
          <RevealLine frame={frame} start={start + 18} color={TEAL} width={52} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "8px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Vila uz more
          </span>
        </div>
        <div style={{ marginTop: 40, opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 118, color: STONE, lineHeight: 0.95, textShadow: "0 6px 44px rgba(13,27,30,0.95)" }}>
          Dobrodošli
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: "italic", fontSize: 118, color: TEAL, lineHeight: 1.0, textShadow: "0 6px 44px rgba(13,27,30,0.85)" }}>
          u vaš raj.
        </div>
      </AbsoluteFill>

      {/* DNO — sadržaji */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 90px" }}>
        {[
          { text: "Privatna plaža · Direktan pristup moru", op: f1Op, y: f1Y },
          { text: "Bazen · Sauna · Fitness centar",         op: f2Op, y: f2Y },
          { text: "280 m² · 5 soba · Do 12 gostiju",       op: f3Op, y: f3Y },
        ].map((f) => (
          <div key={f.text} style={{ opacity: f.op, transform: `translateY(${f.y}px)`, display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: STONE, textShadow: "0 2px 14px rgba(0,0,0,0.9)", letterSpacing: "0.5px" }}>
              {f.text}
            </span>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — Soba s pogledom na more ───────────────────────────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s4;

  const tagOp  = elemFade(frame, start + 18, end);
  const h1Clip = revealClip(frame, start + 32);
  const h1Op   = elemFade(frame, start + 32, end);
  const subOp  = elemFade(frame, start + 52, end);
  const subY   = driftUp(frame, start + 52);
  const p1Op   = elemFade(frame, start + 68, end);
  const p1Y    = driftUp(frame, start + 68);
  const p2Op   = elemFade(frame, start + 82, end);
  const p2Y    = driftUp(frame, start + 82);
  const p3Op   = elemFade(frame, start + 96, end);
  const p3Y    = driftUp(frame, start + 96);

  return (
    <AbsoluteFill>
      <PhotoBG src="prikaz-sobe-i-pogled-na-more.jpg" frame={frame} start={start} end={end} zoom="in" />
      {/* Jak overlay na dnu jer je soba bijela */}
      <AbsoluteFill style={{
        background: "linear-gradient(to top, rgba(13,27,30,0.92) 0%, rgba(13,27,30,0.55) 32%, transparent 58%)",
        opacity: sceneFade(frame, start, end),
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 90px" }}>
        <div style={{ opacity: tagOp, marginBottom: 20 }}>
          <RevealLine frame={frame} start={start + 18} color={TEAL} width={44} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "8px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
            Interijer
          </span>
        </div>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 112, color: STONE, lineHeight: 1.0, textShadow: "0 6px 40px rgba(13,27,30,0.98)", marginBottom: 8 }}>
          Svaka soba —<br />
          <span style={{ fontStyle: "italic", color: TEAL }}>pogled na more.</span>
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, color: "rgba(240,234,224,0.88)", marginBottom: 30, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Cijela vila samo vaša
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { label: "5 spavaćih soba", op: p1Op, y: p1Y },
            { label: "5 kupaonica",     op: p2Op, y: p2Y },
            { label: "Klima · WiFi · TV", op: p3Op, y: p3Y },
          ].map((p) => (
            <div key={p.label} style={{ opacity: p.op, transform: `translateY(${p.y}px)`, border: "1px solid rgba(78,157,168,0.7)", borderRadius: 2, padding: "13px 28px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 24, color: TEAL, background: "rgba(13,27,30,0.5)", letterSpacing: "1px" }}>
              {p.label}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Dron shot vile (CTA) ──────────────────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;

  const topOp   = elemFade(frame, start + 16, end);
  const h1Clip  = revealClip(frame, start + 32);
  const h1Op    = elemFade(frame, start + 32, end);
  const h2Clip  = revealClip(frame, start + 52);
  const h2Op    = elemFade(frame, start + 52, end);
  const ctaOp   = elemFade(frame, start + 72, end);
  const ctaY    = driftUp(frame, start + 72);
  const local   = frame - start;
  const pulse   = 1 + interpolate(Math.sin((local / 28) * Math.PI), [-1, 1], [-0.012, 0.012]);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-vilu-dron.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="radial-gradient(ellipse at center, rgba(13,27,30,0.25) 0%, rgba(13,27,30,0.65) 100%), linear-gradient(to bottom, rgba(13,27,30,0.5) 0%, rgba(13,27,30,0.2) 40%, rgba(13,27,30,0.2) 60%, rgba(13,27,30,0.7) 100%)" />

      {/* NAZIV GORE */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "84px 64px 0", textAlign: "center" }}>
        <div style={{ opacity: topOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 0, height: 0 }}>
            {/* linija gore */}
          </div>
          <RevealLine frame={frame} start={start + 16} color={TEAL} width={80} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 44, letterSpacing: "10px", color: TEAL, textTransform: "uppercase", textShadow: "0 4px 30px rgba(13,27,30,0.98), 0 0 60px rgba(13,27,30,0.8)" }}>
            Villa Milana Relax
          </span>
          <RevealLine frame={frame} start={start + 24} color={TEAL} width={80} />
        </div>
      </AbsoluteFill>

      {/* HEADLINE CENTAR */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px", textAlign: "center" }}>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 130, color: STONE, lineHeight: 0.95, textShadow: "0 8px 50px rgba(13,27,30,0.95)" }}>
          Vaše ljeto
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontStyle: "italic", fontSize: 130, color: TEAL, lineHeight: 1.05, textShadow: "0 8px 50px rgba(13,27,30,0.85)", marginBottom: 64 }}>
          počinje ovdje.
        </div>
        <div style={{
          opacity: ctaOp,
          transform: `translateY(${ctaY}px) scale(${pulse})`,
          border: "1.5px solid " + TEAL,
          color: TEAL,
          background: "rgba(13,27,30,0.55)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 28,
          padding: "24px 68px",
          borderRadius: 2,
          letterSpacing: "6px",
          textTransform: "uppercase",
          textShadow: "0 2px 14px rgba(13,27,30,0.9)",
          backdropFilter: "blur(4px)",
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
  const musicVol = interpolate(frame, [0, 30, 720, 750], [0, 0.78, 0.78, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const whooshFrames = [SCENES.s2.start, SCENES.s3.start, SCENES.s4.start, SCENES.s5.start];

  return (
    <AbsoluteFill style={{ background: DEEP }}>
      <style>{`${fontImport}`}</style>
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
