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
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

// ─── PALETA ───────────────────────────────────────────────────────────────────
const TEAL        = "#4E9DA8";
const TEAL_DARK   = "#2A6B74";
const SAND        = "#C8B89A";
const STONE       = "#F0EAE0";
const DEEP        = "#0D1B1E";
const PANEL_DARK  = "#15333A";
const PANEL_LIGHT = "#E7D9C2";

// ─── TIMING — 30s @ 30fps = 900 frames, 6s/scena ─────────────────────────────
const SCENES = {
  s1: { start: 0,   end: 180 },
  s2: { start: 180, end: 360 },
  s3: { start: 360, end: 540 },
  s4: { start: 540, end: 720 },
  s5: { start: 720, end: 900 },
};
const FADE_IN  = 24;
const OUT_AT   = 36;
const FADE_OUT = 28;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function sceneFade(frame: number, start: number, end: number) {
  const i = interpolate(frame, [start, start + FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [end - OUT_AT, end - OUT_AT + FADE_OUT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

function elemFade(frame: number, elemStart: number, sceneEnd: number, dur = 22) {
  const i = interpolate(frame, [elemStart, elemStart + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(frame, [sceneEnd - OUT_AT, sceneEnd - OUT_AT + FADE_OUT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(i, o);
}

// clip-path reveal s lijeva na desno — paddingBottom čuva repove slova (j, š...)
function revealClip(frame: number, start: number): string {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 28, stiffness: 78 } });
  const pct = interpolate(p, [0, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return `inset(0 ${100 - pct}% 0 0)`;
}

function driftUp(frame: number, start: number, dist = 16): number {
  return interpolate(frame, [start, start + 38], [dist, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function slidePct(frame: number, start: number): number {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 24, stiffness: 78 } });
  return interpolate(p, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Reveal — naslov, clip-path otkrivanje + prostor za descendere
const Reveal: React.FC<{ frame: number; start: number; sceneEnd: number; children: React.ReactNode }> = ({ frame, start, sceneEnd, children }) => {
  const op = elemFade(frame, start, sceneEnd);
  const clip = revealClip(frame, start);
  return (
    <div style={{ opacity: op, clipPath: clip, paddingBottom: "0.22em", marginBottom: "-0.22em" }}>
      {children}
    </div>
  );
};

// Fade — fade in + blagi drift gore, fade out sa scenom
const Fade: React.FC<{ frame: number; start: number; sceneEnd: number; dist?: number; children: React.ReactNode }> = ({ frame, start, sceneEnd, dist = 16, children }) => {
  const op = elemFade(frame, start, sceneEnd);
  const y = driftUp(frame, start, dist);
  return <div style={{ opacity: op, transform: `translateY(${y}px)` }}>{children}</div>;
};

// ─── FOTO POZADINA (full-bleed, ispod panela) ────────────────────────────────
const PhotoBG: React.FC<{ src: string; frame: number; start: number; end: number; zoom?: "in" | "out"; overlay?: string }> = ({ src, frame, start, end, zoom = "in", overlay }) => {
  const opacity = sceneFade(frame, start, end);
  const local = frame - start;
  const dur = end - start;
  const scale = interpolate(local, [0, dur], zoom === "in" ? [1.05, 1.0] : [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "center center" }} />
      {overlay && <AbsoluteFill style={{ background: overlay }} />}
    </AbsoluteFill>
  );
};

// ─── SPLIT LINIJA — horizontalna, "crta se" preko granice panel/foto ─────────
const SplitLineH: React.FC<{ frame: number; start: number; sceneEnd: number; y: number }> = ({ frame, start, sceneEnd, y }) => {
  const op = elemFade(frame, start, sceneEnd, 20);
  const w = interpolate(spring({ frame: frame - start, fps: 30, config: { damping: 30, stiffness: 90 } }), [0, 1], [0, 1080], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{ position: "absolute", top: y, left: 0, width: w, height: 1.5, background: TEAL }} />
      <div style={{ position: "absolute", top: y - 4, left: 0, width: 9, height: 9, borderRadius: "50%", background: TEAL }} />
    </AbsoluteFill>
  );
};

// ─── SPLIT LINIJA — vertikalna ────────────────────────────────────────────────
const SplitLineV: React.FC<{ frame: number; start: number; sceneEnd: number; x: number }> = ({ frame, start, sceneEnd, x }) => {
  const op = elemFade(frame, start, sceneEnd, 20);
  const h = interpolate(spring({ frame: frame - start, fps: 30, config: { damping: 30, stiffness: 90 } }), [0, 1], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op }}>
      <div style={{ position: "absolute", top: 0, left: x, width: 1.5, height: h, background: TEAL }} />
      <div style={{ position: "absolute", top: 0, left: x - 4, width: 9, height: 9, borderRadius: "50%", background: TEAL }} />
    </AbsoluteFill>
  );
};

// ─── PANEL — klizi iz ruba, čista boja (bez sjena na tekstu unutra) ──────────
const Panel: React.FC<{
  frame: number; start: number; end: number;
  side: "bottom" | "top" | "right";
  size: number;
  bg: string;
  children: React.ReactNode;
}> = ({ frame, start, end, side, size, bg, children }) => {
  const op = sceneFade(frame, start, end);
  const p = slidePct(frame, start + 8);

  const base: React.CSSProperties = {
    position: "absolute",
    background: bg,
    opacity: op,
    display: "flex",
    flexDirection: "column",
  };

  let style: React.CSSProperties;
  if (side === "bottom") {
    style = { ...base, bottom: 0, left: 0, width: "100%", height: size, transform: `translateY(${p}%)` };
  } else if (side === "top") {
    style = { ...base, top: 0, left: 0, width: "100%", height: size, transform: `translateY(${-p}%)` };
  } else {
    style = { ...base, top: 0, right: 0, width: size, height: "100%", transform: `translateX(${p}%)` };
  }

  return <div style={style}>{children}</div>;
};

// ─── SCENE 1 — Terasa u suton (HOOK) ─────────────────────────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;
  const PANEL_H = 730;

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-terasu-i-more-predvecer.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.55) 0%, rgba(13,27,30,0.12) 24%, transparent 42%)" />

      <AbsoluteFill style={{ padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <Fade frame={frame} start={start + 16} sceneEnd={end}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 30, letterSpacing: "9px", color: STONE, textTransform: "uppercase", textShadow: "0 2px 10px rgba(13,27,30,0.85), 0 10px 36px rgba(13,27,30,0.5)" }}>
            Rijeka · Hrvatska
          </span>
        </Fade>
      </AbsoluteFill>

      <SplitLineH frame={frame} start={start + 6} sceneEnd={end} y={1920 - PANEL_H} />

      <Panel frame={frame} start={start} end={end} side="bottom" size={PANEL_H} bg={PANEL_DARK}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
          <Fade frame={frame} start={start + 26} sceneEnd={end}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 26, letterSpacing: "8px", color: SAND, textTransform: "uppercase" }}>
              Villa Milana Relax
            </span>
          </Fade>

          <div style={{ marginTop: 22 }}>
            <Reveal frame={frame} start={start + 40} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 116, lineHeight: 1.12, color: STONE }}>
                Život uz more.
              </div>
            </Reveal>
            <Reveal frame={frame} start={start + 62} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 116, lineHeight: 1.12, color: TEAL }}>
                Samo vaš.
              </div>
            </Reveal>
          </div>

          <Fade frame={frame} start={start + 88} sceneEnd={end}>
            <div style={{ marginTop: 40, display: "flex", alignItems: "baseline", gap: 22 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 64, color: STONE, lineHeight: 1 }}>10.0</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 30, color: STONE }}>Izuzetan</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 26, color: SAND, letterSpacing: "2px", marginTop: 2 }}>3 recenzije · Booking.com</span>
              </div>
            </div>
          </Fade>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Stol za večeru u suton ────────────────────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;
  const PANEL_H = 614;

  return (
    <AbsoluteFill>
      <PhotoBG src="stol-za-veceru-predvecer.jpg" frame={frame} start={start} end={end} zoom="in"
        overlay="linear-gradient(to top, rgba(13,27,30,0.88) 0%, rgba(13,27,30,0.32) 30%, transparent 56%)" />

      <SplitLineH frame={frame} start={start + 6} sceneEnd={end} y={PANEL_H} />

      <Panel frame={frame} start={start} end={end} side="top" size={PANEL_H} bg={PANEL_LIGHT}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
          <Fade frame={frame} start={start + 18} sceneEnd={end}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 26, letterSpacing: "8px", color: TEAL_DARK, textTransform: "uppercase" }}>
              Večera uz more
            </span>
          </Fade>
          <div style={{ marginTop: 18 }}>
            <Reveal frame={frame} start={start + 38} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 100, lineHeight: 1.12, color: DEEP }}>
                Večere koje
              </div>
            </Reveal>
            <Reveal frame={frame} start={start + 60} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 100, lineHeight: 1.12, color: TEAL_DARK }}>
                ostaju u sjećanju.
              </div>
            </Reveal>
          </div>
          <Fade frame={frame} start={start + 86} sceneEnd={end}>
            <div style={{ marginTop: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: "rgba(13,27,30,0.75)", letterSpacing: "1px" }}>
              Restoran · Terasa uz more · Doručak
            </div>
          </Fade>
        </div>
      </Panel>

      {/* CITAT na fotografiji */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 90px" }}>
        <Fade frame={frame} start={start + 108} sceneEnd={end} dist={20}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontStyle: "italic", fontSize: 32, color: STONE, lineHeight: 1.6, textShadow: "0 2px 10px rgba(13,27,30,0.9), 0 10px 32px rgba(13,27,30,0.55)" }}>
            „Couldn't have asked for a better experience."
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 28, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 26, color: TEAL, letterSpacing: "3px", textShadow: "0 2px 10px rgba(13,27,30,0.9)" }}>
              Sabbag ★★★★★
            </span>
          </div>
        </Fade>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — Stepenice noću (Dobrodošli + sve činjenice JEDNOM) ────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;
  const PANEL_W = 440;

  return (
    <AbsoluteFill>
      <PhotoBG src="stepenice-prema-vili.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.5) 0%, transparent 26%), linear-gradient(to right, transparent 58%, rgba(13,27,30,0.2) 100%)" />

      <AbsoluteFill style={{ padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <Fade frame={frame} start={start + 16} sceneEnd={end}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 28, letterSpacing: "9px", color: STONE, textTransform: "uppercase", textShadow: "0 2px 10px rgba(13,27,30,0.85), 0 10px 36px rgba(13,27,30,0.5)" }}>
            Vila uz more
          </span>
        </Fade>
      </AbsoluteFill>

      <SplitLineV frame={frame} start={start + 6} sceneEnd={end} x={1080 - PANEL_W} />

      <Panel frame={frame} start={start} end={end} side="right" size={PANEL_W} bg={PANEL_DARK}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
          <Reveal frame={frame} start={start + 36} sceneEnd={end}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 58, lineHeight: 1.15, color: STONE }}>
              Dobrodošli
            </div>
          </Reveal>
          <Reveal frame={frame} start={start + 58} sceneEnd={end}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 58, lineHeight: 1.15, color: TEAL, marginBottom: 56 }}>
              u vaš raj.
            </div>
          </Reveal>

          {[
            { t: "Privatna plaža", s: start + 82 },
            { t: "Bazen · Sauna · Fitness", s: start + 102 },
            { t: "5 soba · 12 gostiju", s: start + 122 },
          ].map((f, i) => (
            <Fade key={i} frame={frame} start={f.s} sceneEnd={end}>
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 26 }}>
                <div style={{ width: 30, height: 1.5, background: TEAL, marginBottom: 12 }} />
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: STONE, letterSpacing: "0.5px" }}>
                  {f.t}
                </span>
              </div>
            </Fade>
          ))}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — Soba s pogledom na more ───────────────────────────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s4;
  const PANEL_H = 691;

  return (
    <AbsoluteFill>
      <PhotoBG src="prikaz-sobe-i-pogled-na-more.jpg" frame={frame} start={start} end={end} zoom="in"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.18) 0%, transparent 32%)" />

      <SplitLineH frame={frame} start={start + 6} sceneEnd={end} y={1920 - PANEL_H} />

      <Panel frame={frame} start={start} end={end} side="bottom" size={PANEL_H} bg={PANEL_LIGHT}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
          <Fade frame={frame} start={start + 18} sceneEnd={end}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 26, letterSpacing: "8px", color: TEAL_DARK, textTransform: "uppercase" }}>
              Interijer
            </span>
          </Fade>
          <div style={{ marginTop: 18 }}>
            <Reveal frame={frame} start={start + 38} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 108, lineHeight: 1.12, color: DEEP }}>
                Svaka soba —
              </div>
            </Reveal>
            <Reveal frame={frame} start={start + 60} sceneEnd={end}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 108, lineHeight: 1.12, color: TEAL_DARK }}>
                pogled na more.
              </div>
            </Reveal>
          </div>
          <Fade frame={frame} start={start + 86} sceneEnd={end}>
            <div style={{ marginTop: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: "rgba(13,27,30,0.75)", letterSpacing: "1px" }}>
              Klima · WiFi · Smart TV
            </div>
          </Fade>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Dron shot (CTA) ────────────────────────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;
  const PANEL_H = 864;
  const local = frame - start;
  const pulse = 1 + interpolate(Math.sin((local / 30) * Math.PI), [-1, 1], [-0.012, 0.012]);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-vilu-dron.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.35) 0%, rgba(13,27,30,0.08) 42%, transparent 60%)" />

      <SplitLineH frame={frame} start={start + 6} sceneEnd={end} y={1920 - PANEL_H} />

      <Panel frame={frame} start={start} end={end} side="bottom" size={PANEL_H} bg={PANEL_DARK}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px", textAlign: "center" }}>
          <Fade frame={frame} start={start + 20} sceneEnd={end}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 44 }}>
              <div style={{ width: 50, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 28, letterSpacing: "8px", color: TEAL, textTransform: "uppercase" }}>
                Villa Milana Relax
              </span>
              <div style={{ width: 50, height: 1, background: TEAL }} />
            </div>
          </Fade>

          <Reveal frame={frame} start={start + 42} sceneEnd={end}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 116, lineHeight: 1.12, color: STONE, textAlign: "center" }}>
              Vaše ljeto
            </div>
          </Reveal>
          <Reveal frame={frame} start={start + 64} sceneEnd={end}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 116, lineHeight: 1.12, color: TEAL, textAlign: "center", marginBottom: 56 }}>
              počinje ovdje.
            </div>
          </Reveal>

          <Fade frame={frame} start={start + 90} sceneEnd={end}>
            <div style={{
              transform: `scale(${pulse})`,
              border: `1px solid ${TEAL}`,
              color: STONE,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: 28,
              padding: "24px 70px",
              letterSpacing: "7px",
              textTransform: "uppercase",
            }}>
              Rezervirajte · Booking.com
            </div>
          </Fade>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export const VillaMilanaReel: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVol = interpolate(frame, [0, 30, 870, 900], [0, 0.78, 0.78, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
