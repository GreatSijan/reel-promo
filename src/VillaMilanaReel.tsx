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
const TEAL  = "#4E9DA8";
const SAND  = "#C8B89A";
const STONE = "#F0EAE0";
const DEEP  = "#0D1B1E";

// ─── TIMING ───────────────────────────────────────────────────────────────────
const SCENES = {
  s1: { start: 0,   end: 150 },
  s2: { start: 150, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
  s5: { start: 600, end: 750 },
};
const FADE   = 22;
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

function revealClip(frame: number, start: number): string {
  const p = spring({ frame: frame - start, fps: 30, config: { damping: 28, stiffness: 80 } });
  const pct = interpolate(p, [0, 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return `inset(0 ${100 - pct}% 0 0)`;
}

function driftUp(frame: number, start: number, dist = 20): number {
  return interpolate(frame, [start, start + 40], [dist, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── FOTO POZADINA ────────────────────────────────────────────────────────────
const PhotoBG: React.FC<{
  src: string; frame: number; start: number; end: number;
  zoom?: "in" | "out"; overlay?: string;
}> = ({ src, frame, start, end, zoom = "in", overlay }) => {
  const opacity = sceneFade(frame, start, end);
  const local   = frame - start;
  const dur     = end - start;
  const scale   = interpolate(local, [0, dur], zoom === "in" ? [1.06, 1.0] : [1.0, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const def     = "linear-gradient(to bottom, rgba(13,27,30,0.35) 0%, transparent 30%, transparent 52%, rgba(13,27,30,0.85) 100%)";
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "center center" }} />
      <AbsoluteFill style={{ background: overlay ?? def }} />
    </AbsoluteFill>
  );
};

// ─── MEDITERANSKI MOTIVI ──────────────────────────────────────────────────────

// 1. ORGANSKA MORSKA STIJENA — raste iz dna, tirkizna, s tekstom unutra (S1)
const RockFormation: React.FC<{
  frame: number; sceneStart: number; sceneEnd: number;
  children: React.ReactNode;
}> = ({ frame, sceneStart, sceneEnd, children }) => {
  const growP = spring({ frame: frame - (sceneStart + 60), fps: 30, config: { damping: 32, stiffness: 55 } });
  const height = interpolate(growP, [0, 1], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = elemFade(frame, sceneStart + 60, sceneEnd, 25);

  // Organska SVG stijena — nepravilni vrhovi
  const svgPath = `
    M0,${520 - height}
    C80,${480 - height} 130,${440 - height} 200,${460 - height}
    C260,${475 - height} 290,${420 - height} 360,${430 - height}
    C430,${440 - height} 470,${395 - height} 540,${410 - height}
    C610,${422 - height} 650,${380 - height} 720,${398 - height}
    C790,${412 - height} 840,${370 - height} 900,${385 - height}
    C960,${398 - height} 1000,${360 - height} 1080,${375 - height}
    L1080,520 L0,520 Z
  `;

  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg
        viewBox="0 0 1080 520"
        width="1080"
        height="520"
        style={{ position: "absolute", bottom: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.92" />
            <stop offset="100%" stopColor="#2A6B74" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <path d={svgPath} fill="url(#rockGrad)" />
      </svg>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 520,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 70px 52px",
        opacity: interpolate(height, [200, 420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// 2. VAL KOJI SE ŠIRI — dekorativni luk na vrhu scene (S2)
const WaveArc: React.FC<{ frame: number; sceneStart: number; sceneEnd: number }> = ({ frame, sceneStart, sceneEnd }) => {
  const p = spring({ frame: frame - (sceneStart + 16), fps: 30, config: { damping: 30, stiffness: 70 } });
  const scale = interpolate(p, [0, 1], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = elemFade(frame, sceneStart + 16, sceneEnd, 22);
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 180" width="1080" height="180"
        style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top center", transform: `scaleY(${scale})` }}
        preserveAspectRatio="none">
        <path
          d="M0,0 Q270,140 540,80 Q810,20 1080,110 L1080,0 Z"
          fill={TEAL} fillOpacity="0.18"
        />
        <path
          d="M0,0 Q220,100 480,50 Q740,0 1080,70 L1080,0 Z"
          fill={TEAL} fillOpacity="0.10"
        />
      </svg>
    </AbsoluteFill>
  );
};

// 3. MASLINOVA GRANA — SVG dekoracija desno (S3)
const OliveBranch: React.FC<{ frame: number; sceneStart: number; sceneEnd: number }> = ({ frame, sceneStart, sceneEnd }) => {
  const p = spring({ frame: frame - (sceneStart + 20), fps: 30, config: { damping: 26, stiffness: 60 } });
  const rotate = interpolate(p, [0, 1], [-15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = elemFade(frame, sceneStart + 20, sceneEnd, 25);
  return (
    <AbsoluteFill style={{ opacity: op * 0.55, pointerEvents: "none" }}>
      <svg viewBox="0 0 320 600" width="320" height="600"
        style={{ position: "absolute", right: -30, top: 60, transformOrigin: "top right", transform: `rotate(${rotate}deg)` }}>
        {/* Stabljika */}
        <path d="M160,0 C155,80 145,180 130,280 C118,360 100,440 85,540" stroke={TEAL} strokeWidth="3" fill="none" strokeOpacity="0.8" />
        {/* Listovi lijevo */}
        {[60,110,165,220,275,330,385].map((y, i) => (
          <ellipse key={`l${i}`} cx={130 - i*4} cy={y} rx="22" ry="9"
            fill={TEAL} fillOpacity="0.7"
            transform={`rotate(${-35 - i*5}, ${130 - i*4}, ${y})`} />
        ))}
        {/* Listovi desno */}
        {[85,140,195,250,305,360].map((y, i) => (
          <ellipse key={`r${i}`} cx={145 + i*3} cy={y} rx="20" ry="8"
            fill={TEAL} fillOpacity="0.6"
            transform={`rotate(${30 + i*4}, ${145 + i*3}, ${y})`} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// 4. SUNČEVI ZRACI — radijalni iz kuta (S4)
const SunRays: React.FC<{ frame: number; sceneStart: number; sceneEnd: number }> = ({ frame, sceneStart, sceneEnd }) => {
  const p = spring({ frame: frame - (sceneStart + 14), fps: 30, config: { damping: 35, stiffness: 50 } });
  const scale = interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = elemFade(frame, sceneStart + 14, sceneEnd, 30);
  const local = frame - sceneStart;
  const rotate = interpolate(local, [0, 150], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op * 0.45, pointerEvents: "none" }}>
      <svg viewBox="0 0 800 800" width="800" height="800"
        style={{ position: "absolute", top: -200, right: -200, transformOrigin: "center", transform: `scale(${scale}) rotate(${rotate}deg)` }}>
        {[0,18,36,54,72,90,108,126,144,162].map((angle, i) => (
          <line key={i}
            x1="400" y1="400"
            x2={400 + Math.cos((angle * Math.PI) / 180) * 700}
            y2={400 + Math.sin((angle * Math.PI) / 180) * 700}
            stroke={TEAL} strokeWidth={i % 2 === 0 ? "2" : "1"}
            strokeOpacity={i % 2 === 0 ? "0.6" : "0.3"}
          />
        ))}
        <circle cx="400" cy="400" r="40" fill={TEAL} fillOpacity="0.15" />
        <circle cx="400" cy="400" r="20" fill={TEAL} fillOpacity="0.25" />
      </svg>
    </AbsoluteFill>
  );
};

// 5. HORIZONT MORA — tanka linija s valom (S5 CTA zona)
const SeaHorizon: React.FC<{ frame: number; sceneStart: number; sceneEnd: number }> = ({ frame, sceneStart, sceneEnd }) => {
  const lineW = interpolate(frame, [sceneStart + 30, sceneStart + 70], [0, 1080], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = elemFade(frame, sceneStart + 30, sceneEnd, 25);
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Tanka horizont linija */}
        <line x1="0" y1="960" x2={lineW} y2="960" stroke={TEAL} strokeWidth="1" strokeOpacity="0.5" />
        {/* Mali val ispod linije */}
        <path
          d={`M0,980 Q${lineW * 0.25},970 ${lineW * 0.5},980 Q${lineW * 0.75},990 ${lineW},980`}
          stroke={TEAL} strokeWidth="1.5" fill="none" strokeOpacity="0.3"
        />
      </svg>
    </AbsoluteFill>
  );
};

// ─── SCENE 1 — Terasa u suton (HOOK + Organska stijena) ──────────────────────
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s1;
  const tagOp  = elemFade(frame, start + 18, end);
  const h1Clip = revealClip(frame, start + 32);
  const h1Op   = elemFade(frame, start + 32, end);
  const h2Clip = revealClip(frame, start + 52);
  const h2Op   = elemFade(frame, start + 52, end);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-terasu-i-more-predvecer.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="radial-gradient(ellipse at center, transparent 20%, rgba(13,27,30,0.5) 100%), linear-gradient(to bottom, rgba(13,27,30,0.45) 0%, transparent 28%, transparent 48%, rgba(13,27,30,0.7) 100%)" />

      {/* TAG GORE */}
      <AbsoluteFill style={{ padding: "76px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ width: interpolate(frame, [start + 18, start + 46], [0, 48], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 1.5, background: TEAL }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "9px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 16px rgba(0,0,0,0.95)" }}>
            Rijeka · Hrvatska
          </span>
        </div>
      </AbsoluteFill>

      {/* HEADLINE CENTAR — boldniji za čitljivost */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 140, color: STONE, lineHeight: 0.95, textShadow: "0 4px 60px rgba(13,27,30,1), 0 2px 20px rgba(13,27,30,0.95)", letterSpacing: "-1px" }}>
          Život uz more.
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 140, color: TEAL, lineHeight: 1.05, textShadow: "0 4px 60px rgba(13,27,30,1), 0 2px 20px rgba(13,27,30,0.9)", letterSpacing: "-1px", marginTop: 4 }}>
          Samo vaš.
        </div>
      </AbsoluteFill>

      {/* ORGANSKA STIJENA DNO s ratingom */}
      <RockFormation frame={frame} sceneStart={start} sceneEnd={end}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 20, letterSpacing: "8px", color: "rgba(240,234,224,0.75)", textTransform: "uppercase", marginBottom: 12 }}>
          Villa Milana Relax
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 72, color: STONE, lineHeight: 1, textShadow: "0 2px 20px rgba(13,27,30,0.5)" }}>
            10.0
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 26, color: STONE }}>Izuzetan</span>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 18, color: "rgba(240,234,224,0.7)", letterSpacing: "2px" }}>3 recenzije · Booking.com</span>
          </div>
        </div>
      </RockFormation>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 — Stol za večeru (Val luk gore + citat) ─────────────────────────
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s2;
  const tagOp  = elemFade(frame, start + 22, end);
  const h1Clip = revealClip(frame, start + 36);
  const h1Op   = elemFade(frame, start + 36, end);
  const h2Clip = revealClip(frame, start + 56);
  const h2Op   = elemFade(frame, start + 56, end);
  const subOp  = elemFade(frame, start + 76, end);
  const subY   = driftUp(frame, start + 76);
  const qOp    = elemFade(frame, start + 96, end);
  const qY     = driftUp(frame, start + 96);

  return (
    <AbsoluteFill>
      <PhotoBG src="stol-za-veceru-predvecer.jpg" frame={frame} start={start} end={end} zoom="in"
        overlay="linear-gradient(to right, rgba(13,27,30,0.75) 0%, rgba(13,27,30,0.3) 55%, transparent 100%)" />

      <WaveArc frame={frame} sceneStart={start} sceneEnd={end} />

      <AbsoluteFill style={{ padding: "88px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, marginBottom: 36 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "9px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Večera uz more
          </span>
        </div>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 122, color: STONE, lineHeight: 0.95, textShadow: "0 4px 50px rgba(13,27,30,1)" }}>
          Večere koje
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 122, color: TEAL, lineHeight: 1.0, textShadow: "0 4px 50px rgba(13,27,30,0.9)", marginBottom: 36 }}>
          ostaju u sjećanju.
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: "rgba(240,234,224,0.88)", textShadow: "0 2px 16px rgba(0,0,0,0.9)", letterSpacing: "1px" }}>
          Restoran · Terasa uz more · Doručak
        </div>
      </AbsoluteFill>

      {/* CITAT DNO — bez bordere, elegantno */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 92px" }}>
        <div style={{ opacity: qOp, transform: `translateY(${qY}px)` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontStyle: "italic", fontSize: 32, color: "rgba(240,234,224,0.9)", lineHeight: 1.6, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            „Couldn't have asked for a better experience."
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 28, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: 22, color: TEAL, letterSpacing: "3px" }}>
              Sabbag ★★★★★
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 — Stepenice noću (Maslinova grana + sadržaji) ───────────────────
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s3;
  const tagOp  = elemFade(frame, start + 18, end);
  const h1Clip = revealClip(frame, start + 32);
  const h1Op   = elemFade(frame, start + 32, end);
  const h2Clip = revealClip(frame, start + 52);
  const h2Op   = elemFade(frame, start + 52, end);
  const f1Op   = elemFade(frame, start + 72, end);
  const f1Y    = driftUp(frame, start + 72);
  const f2Op   = elemFade(frame, start + 88, end);
  const f2Y    = driftUp(frame, start + 88);
  const f3Op   = elemFade(frame, start + 104, end);
  const f3Y    = driftUp(frame, start + 104);

  return (
    <AbsoluteFill>
      <PhotoBG src="stepenice-prema-vili.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="linear-gradient(to bottom, rgba(13,27,30,0.65) 0%, rgba(13,27,30,0.15) 35%, transparent 55%, rgba(13,27,30,0.82) 100%)" />

      <OliveBranch frame={frame} sceneStart={start} sceneEnd={end} />

      <AbsoluteFill style={{ padding: "76px 64px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, marginBottom: 36 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "9px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}>
            Vila uz more
          </span>
        </div>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 120, color: STONE, lineHeight: 0.95, textShadow: "0 4px 50px rgba(13,27,30,1)" }}>
          Dobrodošli
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 120, color: TEAL, lineHeight: 1.05, textShadow: "0 4px 50px rgba(13,27,30,0.9)" }}>
          u vaš raj.
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 90px" }}>
        {[
          { text: "Privatna plaža · Direktan pristup moru", op: f1Op, y: f1Y },
          { text: "Bazen · Sauna · Fitness centar",         op: f2Op, y: f2Y },
          { text: "280 m² · 5 soba · Do 12 gostiju",       op: f3Op, y: f3Y },
        ].map((f, i) => (
          <div key={i} style={{ opacity: f.op, transform: `translateY(${f.y}px)`, display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
            {/* Tirkizna horizontalna crtica umjesto točke */}
            <div style={{ width: 22, height: 1.5, background: TEAL, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 30, color: STONE, textShadow: "0 2px 14px rgba(0,0,0,0.9)", letterSpacing: "0.5px" }}>
              {f.text}
            </span>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 — Soba s pogledom (Sunčevi zraci + interijer) ───────────────────
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s4;
  const tagOp  = elemFade(frame, start + 18, end);
  const h1Clip = revealClip(frame, start + 32);
  const h1Op   = elemFade(frame, start + 32, end);
  const subOp  = elemFade(frame, start + 56, end);
  const subY   = driftUp(frame, start + 56);
  const p1Op   = elemFade(frame, start + 74, end);
  const p1Y    = driftUp(frame, start + 74);
  const p2Op   = elemFade(frame, start + 90, end);
  const p2Y    = driftUp(frame, start + 90);
  const p3Op   = elemFade(frame, start + 106, end);
  const p3Y    = driftUp(frame, start + 106);

  return (
    <AbsoluteFill>
      <PhotoBG src="prikaz-sobe-i-pogled-na-more.jpg" frame={frame} start={start} end={end} zoom="in" />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(13,27,30,0.94) 0%, rgba(13,27,30,0.55) 32%, transparent 60%)", opacity: sceneFade(frame, start, end) }} />

      <SunRays frame={frame} sceneStart={start} sceneEnd={end} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 90px" }}>
        <div style={{ opacity: tagOp, marginBottom: 20 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 22, letterSpacing: "9px", color: SAND, textTransform: "uppercase", textShadow: "0 2px 12px rgba(0,0,0,0.95)" }}>
            Interijer
          </span>
        </div>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 114, color: STONE, lineHeight: 1.0, textShadow: "0 4px 50px rgba(13,27,30,1)", marginBottom: 28 }}>
          Svaka soba —<br />
          <span style={{ fontStyle: "italic", fontWeight: 400, color: TEAL }}>pogled na more.</span>
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, color: "rgba(240,234,224,0.88)", marginBottom: 32, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          Cijela vila samo vaša
        </div>
        {/* Tekst lista umjesto pill-ova */}
        {[
          { label: "5 spavaćih soba", op: p1Op, y: p1Y },
          { label: "5 kupaonica",     op: p2Op, y: p2Y },
          { label: "Klima · WiFi · TV", op: p3Op, y: p3Y },
        ].map((p, i) => (
          <div key={i} style={{ opacity: p.op, transform: `translateY(${p.y}px)`, display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", border: `1.5px solid ${TEAL}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 28, color: STONE, textShadow: "0 2px 12px rgba(0,0,0,0.9)", letterSpacing: "0.5px" }}>
              {p.label}
            </span>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 — Dron shot (Horizont mora + CTA) ───────────────────────────────
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const { start, end } = SCENES.s5;
  const topOp  = elemFade(frame, start + 16, end);
  const h1Clip = revealClip(frame, start + 34);
  const h1Op   = elemFade(frame, start + 34, end);
  const h2Clip = revealClip(frame, start + 54);
  const h2Op   = elemFade(frame, start + 54, end);
  const ctaOp  = elemFade(frame, start + 78, end);
  const ctaY   = driftUp(frame, start + 78);
  const local  = frame - start;
  const pulse  = 1 + interpolate(Math.sin((local / 28) * Math.PI), [-1, 1], [-0.012, 0.012]);

  return (
    <AbsoluteFill>
      <PhotoBG src="pogled-na-vilu-dron.jpg" frame={frame} start={start} end={end} zoom="out"
        overlay="radial-gradient(ellipse at center, rgba(13,27,30,0.3) 0%, rgba(13,27,30,0.68) 100%), linear-gradient(to bottom, rgba(13,27,30,0.55) 0%, rgba(13,27,30,0.2) 40%, rgba(13,27,30,0.2) 60%, rgba(13,27,30,0.72) 100%)" />

      <SeaHorizon frame={frame} sceneStart={start} sceneEnd={end} />

      {/* NAZIV GORE */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "84px 64px 0", textAlign: "center" }}>
        <div style={{ opacity: topOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: interpolate(frame, [start + 16, start + 50], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 1, background: TEAL }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 46, letterSpacing: "10px", color: TEAL, textTransform: "uppercase", textShadow: "0 4px 30px rgba(13,27,30,0.98), 0 0 60px rgba(13,27,30,0.8)" }}>
            Villa Milana Relax
          </span>
          <div style={{ width: interpolate(frame, [start + 24, start + 58], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), height: 1, background: TEAL }} />
        </div>
      </AbsoluteFill>

      {/* HEADLINE CENTAR */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px", textAlign: "center" }}>
        <div style={{ opacity: h1Op, clipPath: h1Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 134, color: STONE, lineHeight: 0.95, textShadow: "0 4px 60px rgba(13,27,30,1)" }}>
          Vaše ljeto
        </div>
        <div style={{ opacity: h2Op, clipPath: h2Clip, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 134, color: TEAL, lineHeight: 1.05, textShadow: "0 4px 60px rgba(13,27,30,0.9)", marginBottom: 70 }}>
          počinje ovdje.
        </div>
        <div style={{
          opacity: ctaOp,
          transform: `translateY(${ctaY}px) scale(${pulse})`,
          border: "1px solid rgba(78,157,168,0.8)",
          color: STONE,
          background: "rgba(13,27,30,0.45)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontSize: 26,
          padding: "22px 70px",
          borderRadius: 1,
          letterSpacing: "7px",
          textTransform: "uppercase",
          textShadow: "0 2px 14px rgba(13,27,30,0.9)",
          backdropFilter: "blur(6px)",
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
