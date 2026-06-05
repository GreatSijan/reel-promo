import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── helpers ────────────────────────────────────────────────────────────────
const fps30 = (sec: number) => Math.round(sec * 30);

function fadeIn(frame: number, start: number, dur = 20) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function fadeOut(frame: number, start: number, dur = 15) {
  return interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function slideUp(frame: number, start: number, cfg = { damping: 18, stiffness: 120 }) {
  const progress = spring({ frame: frame - start, fps: 30, config: cfg });
  return interpolate(progress, [0, 1], [60, 0]);
}

// ─── Scene helpers ──────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const CREAM = "#F5EFE0";
const DARK = "#0A0A0A";
const SLATE = "#1A1A1A";

// ─── Scene 1: HOOK ──────────────────────────────────────────────────────────
// 0 – 90 frames (3 s)
function SceneHook({ frame }: { frame: number }) {
  const opacity = fadeIn(frame, 0, 25);
  const fadeO = frame > 75 ? fadeOut(frame, 75, 15) : 1;
  const combined = opacity * fadeO;

  const line1Y = slideUp(frame, 10);
  const line1Op = fadeIn(frame, 10, 20);

  const line2Y = slideUp(frame, 28);
  const line2Op = fadeIn(frame, 28, 20);

  const subOp = fadeIn(frame, 50, 20);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 60%, #1a1208 0%, ${DARK} 70%)`,
        opacity: combined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      {/* decorative line */}
      <div
        style={{
          width: interpolate(frame, [5, 35], [0, 120], { extrapolateRight: "clamp" }),
          height: 2,
          background: GOLD,
          marginBottom: 40,
        }}
      />

      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 82,
          fontWeight: 700,
          color: CREAM,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: line1Op,
          transform: `translateY(${line1Y}px)`,
          letterSpacing: "-1px",
        }}
      >
        Zamislite
      </div>

      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 82,
          fontWeight: 700,
          color: GOLD,
          lineHeight: 1.05,
          textAlign: "center",
          opacity: line2Op,
          transform: `translateY(${line2Y}px)`,
          letterSpacing: "-1px",
        }}
      >
        savršeno jutro...
      </div>

      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 26,
          color: "#9A8A6A",
          marginTop: 32,
          letterSpacing: "3px",
          textTransform: "uppercase",
          opacity: subOp,
        }}
      >
        Istra · Hrvatska
      </div>

      {/* bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: interpolate(frame, [40, 80], [0, 200], { extrapolateRight: "clamp" }),
          height: 1,
          background: GOLD,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
}

// ─── Scene 2: POOL LIFESTYLE ─────────────────────────────────────────────────
// 90 – 210 frames (4 s)
function ScenePool({ frame }: { frame: number }) {
  const local = frame - 90;
  const opacity = fadeIn(local, 0, 20);
  const fadeO = local > 100 ? fadeOut(local, 100, 20) : 1;
  const combined = opacity * fadeO;

  const titleOp = fadeIn(local, 15, 25);
  const titleY = slideUp(local, 15);
  const desc1Op = fadeIn(local, 35, 20);
  const desc2Op = fadeIn(local, 52, 20);
  const badgeOp = fadeIn(local, 70, 20);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #0d1a2e 0%, #0a1220 50%, ${DARK} 100%)`,
        opacity: combined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      {/* accent bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
        <div style={{ width: 4, height: 60, background: GOLD, borderRadius: 2 }} />
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 14,
            color: GOLD,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Privatni raj
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 76,
          fontWeight: 700,
          color: CREAM,
          lineHeight: 1.0,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Vaš privatni
        <br />
        <span style={{ color: GOLD }}>bazen.</span>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {[
          { icon: "🌊", text: "Bazen s morskom vodom — samo za vas", op: desc1Op },
          { icon: "☀️", text: "Ležaljke, suncobrani, vanjska terasa", op: desc2Op },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: item.op,
            }}
          >
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 28,
                color: "#C8C0B0",
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* rating badge */}
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 100,
          opacity: badgeOp,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            background: GOLD,
            color: DARK,
            fontFamily: "Georgia, serif",
            fontSize: 42,
            fontWeight: 700,
            width: 90,
            height: 90,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          9.7
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 14,
            color: "#9A8A6A",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Booking.com
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: FEATURES ───────────────────────────────────────────────────────
// 210 – 360 frames (5 s)
const FEATURES = [
  { icon: "🏠", title: "Cijela vila — samo vaša", sub: "2 spavaće sobe · do 5 gostiju" },
  { icon: "🍖", title: "Roštilj & vanjska terasa", sub: "Večere pod zvijezdama Istre" },
  { icon: "🔥", title: "Kamin za hladne večeri", sub: "Savršeno i izvan sezone" },
  { icon: "📍", title: "Labin, Istra", sub: "Pecanje · Ronjenje · Biciklizam" },
];

function SceneFeatures({ frame }: { frame: number }) {
  const local = frame - 210;
  const opacity = fadeIn(local, 0, 20);
  const fadeO = local > 130 ? fadeOut(local, 130, 20) : 1;
  const combined = opacity * fadeO;

  return (
    <AbsoluteFill
      style={{
        background: SLATE,
        opacity: combined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 60px",
        gap: 0,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 18,
          color: GOLD,
          letterSpacing: "5px",
          textTransform: "uppercase",
          marginBottom: 30,
          opacity: fadeIn(local, 5, 20),
        }}
      >
        Što vas čeka
      </div>

      {FEATURES.map((f, i) => {
        const startFrame = 20 + i * 22;
        const itemOp = fadeIn(local, startFrame, 18);
        const itemY = slideUp(local, startFrame, { damping: 22, stiffness: 140 });

        return (
          <div
            key={f.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              paddingBottom: 28,
              marginBottom: 28,
              borderBottom: i < FEATURES.length - 1 ? `1px solid #2A2A2A` : "none",
              opacity: itemOp,
              transform: `translateY(${itemY}px)`,
            }}
          >
            <span style={{ fontSize: 40, minWidth: 50 }}>{f.icon}</span>
            <div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: CREAM,
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 20,
                  color: "#7A6A50",
                  marginTop: 4,
                }}
              >
                {f.sub}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ─── Scene 4: REVIEWS ────────────────────────────────────────────────────────
// 360 – 480 frames (4 s)
const REVIEWS = [
  { name: "Petra", text: "Boravak je bio izvanredan! Besprijekorno čisto i idealno za opuštanje." },
  { name: "Ante", text: "Toplo preporučujemo svima koji žele miran i ugodan odmor. Vraćamo se!" },
];

function SceneReviews({ frame }: { frame: number }) {
  const local = frame - 360;
  const opacity = fadeIn(local, 0, 20);
  const fadeO = local > 100 ? fadeOut(local, 100, 20) : 1;
  const combined = opacity * fadeO;

  const titleOp = fadeIn(local, 5, 20);
  const r1Op = fadeIn(local, 25, 25);
  const r1Y = slideUp(local, 25);
  const r2Op = fadeIn(local, 48, 25);
  const r2Y = slideUp(local, 48);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 30%, #1a1208 0%, ${DARK} 70%)`,
        opacity: combined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 65px",
        gap: 30,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 18,
          color: GOLD,
          letterSpacing: "5px",
          textTransform: "uppercase",
          opacity: titleOp,
        }}
      >
        Što kažu gosti
      </div>

      {REVIEWS.map((r, i) => {
        const op = i === 0 ? r1Op : r2Op;
        const y = i === 0 ? r1Y : r2Y;

        return (
          <div
            key={r.name}
            style={{
              background: "#151515",
              border: `1px solid #2A2A2A`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 8,
              padding: "28px 32px",
              opacity: op,
              transform: `translateY(${y}px)`,
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 22,
                color: CREAM,
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              „{r.text}"
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: "Georgia, serif",
                fontSize: 16,
                color: GOLD,
                letterSpacing: "2px",
              }}
            >
              — {r.name} ★★★★★
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ─── Scene 5: CTA ─────────────────────────────────────────────────────────
// 480 – 600 frames (4 s)
function SceneCTA({ frame }: { frame: number }) {
  const local = frame - 480;
  const opacity = fadeIn(local, 0, 25);

  const titleOp = fadeIn(local, 15, 25);
  const titleY = slideUp(local, 15);

  const subOp = fadeIn(local, 38, 20);
  const ctaOp = fadeIn(local, 55, 25);
  const ctaScale = interpolate(
    spring({ frame: local - 55, fps: 30, config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [0.85, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pulse = interpolate(
    Math.sin((local / 30) * Math.PI * 2),
    [-1, 1],
    [0.85, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0c00 0%, #1a1208 50%, #0A0A0A 100%)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        textAlign: "center",
      }}
    >
      {/* stars */}
      <div style={{ fontSize: 32, marginBottom: 24, opacity: fadeIn(local, 5, 20) }}>
        ★★★★★
      </div>

      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 74,
          fontWeight: 700,
          color: CREAM,
          lineHeight: 1.05,
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Vaše ljeto
        <br />
        <span style={{ color: GOLD }}>počinje ovdje.</span>
      </div>

      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 24,
          color: "#8A7A60",
          marginTop: 28,
          letterSpacing: "1px",
          opacity: subOp,
        }}
      >
        Krasna kuća Istra · Labin
      </div>

      {/* CTA button */}
      <div
        style={{
          marginTop: 50,
          opacity: ctaOp,
          transform: `scale(${ctaScale * pulse})`,
          background: GOLD,
          color: DARK,
          fontFamily: "Georgia, serif",
          fontSize: 26,
          fontWeight: 700,
          padding: "20px 56px",
          borderRadius: 6,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Rezervirajte na Booking.com
      </div>

      {/* subtle glow under button */}
      <div
        style={{
          marginTop: 16,
          width: 200,
          height: 4,
          background: GOLD,
          opacity: ctaOp * 0.3,
          borderRadius: 2,
          filter: "blur(6px)",
        }}
      />
    </AbsoluteFill>
  );
}

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
// Total: 600 frames = 20 seconds @ 30fps
export const KrasnaKucaReel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: DARK }}>
      {/* Audio */}
      <Audio src={staticFile("dark-drone-ambient.mp3")} volume={0.35} />
      {frame >= 0 && frame < 10 && (
        <Audio src={staticFile("cinematic-impact-hit.mp3")} volume={0.7} />
      )}
      {frame >= 88 && frame < 98 && (
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={0.5} />
      )}
      {frame >= 208 && frame < 218 && (
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={0.5} />
      )}
      {frame >= 358 && frame < 368 && (
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={0.5} />
      )}
      {frame >= 478 && frame < 488 && (
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={0.5} />
      )}

      {/* Scenes */}
      {frame < 100 && <SceneHook frame={frame} />}
      {frame >= 85 && frame < 220 && <ScenePool frame={frame} />}
      {frame >= 200 && frame < 370 && <SceneFeatures frame={frame} />}
      {frame >= 350 && frame < 490 && <SceneReviews frame={frame} />}
      {frame >= 470 && <SceneCTA frame={frame} />}
    </AbsoluteFill>
  );
};
