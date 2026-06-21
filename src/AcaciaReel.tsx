import { AbsoluteFill, Audio, Sequence, Video, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile } from "remotion";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const FPS = 30;
const W = 1080;
const H = 1920;

// Scene durations in frames
const S1_DUR = 300; // video plaže (10s)
const S2_DUR = 160; // terasa/doručak
const S3_DUR = 160; // soba plava
const S4_DUR = 160; // restaurant
const S5_DUR = 140; // wellness bazen

const FADE = 20; // fade in/out frames
const WHOOSH_VOL = 0.22;

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  navy: "#12263F",
  gold: "#C4943A",
  cream: "#F5F2EE",
  teal: "#5B9EB8",
  darkOverlay: "rgba(12, 22, 38, 0.52)",
  darkOverlayStrong: "rgba(12, 22, 38, 0.68)",
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
const T = {
  display: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
  },
  sub: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontWeight: 400,
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
  },
  label: {
    fontFamily: "Georgia, serif",
    fontWeight: 400,
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const ease = Easing.bezier(0.25, 0.1, 0.25, 1);

function fadeIn(frame: number, start: number, dur = FADE) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}

function fadeOut(frame: number, end: number, dur = FADE) {
  return interpolate(frame, [end - dur, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}

// Combined fade: in at `start`, out at `end`
function sceneAlpha(frame: number, start: number, end: number) {
  if (frame < start + FADE) return fadeIn(frame, start);
  if (frame > end - FADE) return fadeOut(frame, end);
  return 1;
}

// Gold line that draws from left to right
function GoldLine({ frame, start, width = 120 }: { frame: number; start: number; width?: number }) {
  const w = interpolate(frame, [start, start + 30], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        width: w,
        height: 1.5,
        backgroundColor: C.gold,
        marginBottom: 18,
        marginTop: 18,
      }}
    />
  );
}

// Text that fades + rises
function RiseText({
  frame,
  start,
  children,
  style,
}: {
  frame: number;
  start: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const opacity = fadeIn(frame, start);
  const y = interpolate(frame, [start, start + FADE], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── DARK OVERLAY ─────────────────────────────────────────────────────────────
function Overlay({ strength = C.darkOverlay }: { strength?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: strength,
      }}
    />
  );
}

// ─── SCENE 1: Video plaže ─────────────────────────────────────────────────────
function Scene1({ frame }: { frame: number }) {
  // Scene-level alpha (fade in from 0, fade out before S1_DUR)
  const alpha = sceneAlpha(frame, 0, S1_DUR);

  // Text appears after camera settles — around frame 60
  const textStart = 60;
  const textEnd = S1_DUR - FADE - 10;
  const textAlpha =
    frame < textStart
      ? 0
      : frame > textEnd
      ? fadeOut(frame, textEnd)
      : 1;

  const shadow = "0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)";

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <Video
        src={staticFile("video-acaciaa.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        startFrom={0}
        endAt={S1_DUR}
        volume={0}
      />
      <Overlay strength="rgba(12,22,38,0.38)" />

      {/* Bottom-anchored text block */}
      <AbsoluteFill
        style={{
          opacity: textAlpha,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 180px",
        }}
      >
        <RiseText frame={frame} start={textStart} style={{ marginBottom: 0 }}>
          <div
            style={{
              ...T.label,
              fontSize: 22,
              color: C.gold,
              textShadow: shadow,
            }}
          >
            Lovran · Hrvatska
          </div>
        </RiseText>

        <GoldLine frame={frame} start={textStart + 10} width={80} />

        <RiseText frame={frame} start={textStart + 20}>
          <div
            style={{
              ...T.display,
              fontSize: 96,
              lineHeight: 1.05,
              color: C.cream,
              textShadow: shadow,
            }}
          >
            Hotel
            <br />
            Acacia
          </div>
        </RiseText>

        <RiseText frame={frame} start={textStart + 40} style={{ marginTop: 24 }}>
          <div
            style={{
              ...T.sub,
              fontSize: 26,
              color: C.teal,
              textShadow: shadow,
            }}
          >
            Boutique · Sea · Wellness
          </div>
        </RiseText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 2: Terasa / doručak ────────────────────────────────────────────────
function Scene2({ frame }: { frame: number }) {
  const alpha = sceneAlpha(frame, 0, S2_DUR);
  const textEnd = S2_DUR - FADE - 5;
  const shadow = "0 2px 28px rgba(0,0,0,0.85), 0 1px 6px rgba(0,0,0,0.7)";

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <img
        src={staticFile("4scena2kadar.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Gradient overlay — darker at top where sky is bright */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(12,22,38,0.62) 0%, rgba(12,22,38,0.15) 50%, rgba(12,22,38,0.55) 100%)",
        }}
      />

      {/* Top-left: location tag */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "100px 72px 0",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE}>
          <div
            style={{
              ...T.label,
              fontSize: 20,
              color: C.gold,
              textShadow: shadow,
            }}
          >
            Doručak uz more
          </div>
        </RiseText>
        <GoldLine frame={frame} start={FADE + 10} width={70} />
        <RiseText frame={frame} start={FADE + 20}>
          <div
            style={{
              ...T.display,
              fontSize: 88,
              lineHeight: 1.08,
              color: C.cream,
              textShadow: shadow,
            }}
          >
            Počnite
            <br />
            dan savršeno.
          </div>
        </RiseText>
      </AbsoluteFill>

      {/* Bottom: tag */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 120px",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE + 40}>
          <div
            style={{
              ...T.sub,
              fontSize: 24,
              color: C.teal,
              textShadow: shadow,
            }}
          >
            Terasa s pogledom na Kvarner
          </div>
        </RiseText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 3: Soba plava ─────────────────────────────────────────────────────
function Scene3({ frame }: { frame: number }) {
  const alpha = sceneAlpha(frame, 0, S3_DUR);
  const textEnd = S3_DUR - FADE - 5;
  const shadow = "0 2px 28px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)";

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <img
        src={staticFile("2scena2kadar.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Strong bottom gradient — soba je svijetla, tekst ide na dno */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(12,22,38,0.82) 0%, rgba(12,22,38,0.3) 45%, rgba(12,22,38,0.0) 75%)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 140px",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE}>
          <div
            style={{
              ...T.label,
              fontSize: 20,
              color: C.gold,
              textShadow: shadow,
            }}
          >
            Premium soba
          </div>
        </RiseText>
        <GoldLine frame={frame} start={FADE + 10} width={70} />
        <RiseText frame={frame} start={FADE + 20}>
          <div
            style={{
              ...T.display,
              fontSize: 88,
              lineHeight: 1.08,
              color: C.cream,
              textShadow: shadow,
            }}
          >
            Vaš mir.
            <br />
            Vaš prostor.
          </div>
        </RiseText>
        <RiseText frame={frame} start={FADE + 45} style={{ marginTop: 24 }}>
          <div
            style={{
              ...T.sub,
              fontSize: 24,
              color: C.teal,
              textShadow: shadow,
            }}
          >
            King krevet · Zlatni detalji · Lounge
          </div>
        </RiseText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 4: Restaurant ─────────────────────────────────────────────────────
function Scene4({ frame }: { frame: number }) {
  const alpha = sceneAlpha(frame, 0, S4_DUR);
  const textEnd = S4_DUR - FADE - 5;
  const shadow = "0 2px 28px rgba(0,0,0,0.85), 0 1px 6px rgba(0,0,0,0.7)";

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <img
        src={staticFile("4scena.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Overlay strength="rgba(12,22,38,0.48)" />

      {/* Tekst gore — zidovi su sivi i tamni, odličan kontrast */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "140px 72px 0",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE}>
          <div
            style={{
              ...T.label,
              fontSize: 20,
              color: C.gold,
              textShadow: shadow,
            }}
          >
            Fine dining
          </div>
        </RiseText>
        <GoldLine frame={frame} start={FADE + 10} width={70} />
        <RiseText frame={frame} start={FADE + 20}>
          <div
            style={{
              ...T.display,
              fontSize: 88,
              lineHeight: 1.08,
              color: C.cream,
              textShadow: shadow,
            }}
          >
            Večera
            <br />
            za pamćenje.
          </div>
        </RiseText>
      </AbsoluteFill>

      {/* Dno: detalji */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 130px",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE + 45}>
          <div
            style={{
              ...T.sub,
              fontSize: 24,
              color: C.teal,
              textShadow: shadow,
            }}
          >
            Restoran · Svjećana atmosfera
          </div>
        </RiseText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── SCENE 5: Wellness bazen ─────────────────────────────────────────────────
function Scene5({ frame }: { frame: number }) {
  const alpha = sceneAlpha(frame, 0, S5_DUR);
  const textEnd = S5_DUR - FADE - 5;
  const shadow = "0 2px 28px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)";

  return (
    <AbsoluteFill style={{ opacity: alpha }}>
      <img
        src={staticFile("3scena2kadar.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Overlay strength="rgba(12,22,38,0.5)" />

      {/* Sredina — bazen je simetričan, tekst centriran djeluje monumentalno */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 72px",
          opacity: frame > textEnd ? fadeOut(frame, textEnd) : 1,
        }}
      >
        <RiseText frame={frame} start={FADE}>
          <div
            style={{
              ...T.label,
              fontSize: 20,
              color: C.gold,
              textShadow: shadow,
            }}
          >
            Wellness
          </div>
        </RiseText>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoldLine frame={frame} start={FADE + 10} width={80} />
        </div>

        <RiseText frame={frame} start={FADE + 20}>
          <div
            style={{
              ...T.display,
              fontSize: 88,
              lineHeight: 1.08,
              color: C.cream,
              textShadow: shadow,
            }}
          >
            Predajte se
            <br />
            tišini.
          </div>
        </RiseText>

        <RiseText frame={frame} start={FADE + 45} style={{ marginTop: 28 }}>
          <div
            style={{
              ...T.sub,
              fontSize: 24,
              color: C.teal,
              textShadow: shadow,
            }}
          >
            Unutarnji bazen · Sauna · Relax zona
          </div>
        </RiseText>

        {/* CTA */}
        <RiseText frame={frame} start={FADE + 65} style={{ marginTop: 52 }}>
          <div
            style={{
              border: `1.5px solid ${C.gold}`,
              padding: "18px 52px",
              ...T.label,
              fontSize: 22,
              color: C.gold,
              letterSpacing: "0.3em",
              textShadow: shadow,
            }}
          >
            Hotel Acacia · Lovran
          </div>
        </RiseText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ─── MAIN COMPOSITION ────────────────────────────────────────────────────────
export const AcaciaReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const s1Start = 0;
  const s2Start = s1Start + S1_DUR;
  const s3Start = s2Start + S2_DUR;
  const s4Start = s3Start + S3_DUR;
  const s5Start = s4Start + S4_DUR;
  const totalFrames = s5Start + S5_DUR;

  // Audio: glazba od 52s, fade in 1s, fade out zadnje 2s
  const musicFadeIn = interpolate(frame, [0, fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const musicFadeOut = interpolate(
    frame,
    [totalFrames - fps * 2, totalFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const musicVol = Math.min(musicFadeIn, musicFadeOut) * 0.85;

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, width: W, height: H }}>
      {/* ── Glazba ── */}
      <Audio
        src={staticFile("In alto mare (2022 Remastered).mp3")}
        startFrom={52 * fps}
        volume={musicVol}
      />

      {/* ── Whoosh tranzicije ── */}
      <Sequence from={s2Start - 5} durationInFrames={30}>
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={WHOOSH_VOL} />
      </Sequence>
      <Sequence from={s3Start - 5} durationInFrames={30}>
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={WHOOSH_VOL} />
      </Sequence>
      <Sequence from={s4Start - 5} durationInFrames={30}>
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={WHOOSH_VOL} />
      </Sequence>
      <Sequence from={s5Start - 5} durationInFrames={30}>
        <Audio src={staticFile("woosh-cinematic.mp3")} volume={WHOOSH_VOL} />
      </Sequence>

      {/* ── Scene 1 ── */}
      <Sequence from={s1Start} durationInFrames={S1_DUR}>
        <Scene1 frame={frame - s1Start} />
      </Sequence>

      {/* ── Scene 2 ── */}
      <Sequence from={s2Start} durationInFrames={S2_DUR}>
        <Scene2 frame={frame - s2Start} />
      </Sequence>

      {/* ── Scene 3 ── */}
      <Sequence from={s3Start} durationInFrames={S3_DUR}>
        <Scene3 frame={frame - s3Start} />
      </Sequence>

      {/* ── Scene 4 ── */}
      <Sequence from={s4Start} durationInFrames={S4_DUR}>
        <Scene4 frame={frame - s4Start} />
      </Sequence>

      {/* ── Scene 5 ── */}
      <Sequence from={s5Start} durationInFrames={S5_DUR}>
        <Scene5 frame={frame - s5Start} />
      </Sequence>
    </AbsoluteFill>
  );
};
