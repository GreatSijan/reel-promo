import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

export type TextPosition =
  | "top"
  | "top-left"
  | "bottom"
  | "bottom-left"
  | "bottom-left-strong"
  | "top-left-overlay";

export interface PopupCard {
  iconType: string;
  label: string;
}

export interface BedOption {
  iconType: string;
  label: string;
}

interface SceneProps {
  image: string;
  tag: string;
  title: string;
  sub?: string;
  textPosition: TextPosition;
  startFrame: number;
  durationFrames: number;
  fadeIn?: number;
  fadeOut?: number;
  popupCards?: PopupCard[];
  bedOptions?: BedOption[];
  ctaUrl?: string;
}

function kenBurns(frame: number, duration: number) {
  const progress = frame / duration;
  return interpolate(progress, [0, 1], [1.04, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── SVG ICONS ──────────────────────────────────────────────────────────────
const STROKE = "rgba(255,255,255,0.92)";
const SW = 2.2;

const IconPool = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    {/* ladder rails */}
    <path d="M15 6 L15 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M29 6 L29 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    {/* ladder rungs */}
    <line x1="15" y1="13" x2="29" y2="13" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="15" y1="20" x2="29" y2="20" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    {/* top hooks */}
    <path d="M15 6 Q12 6 12 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M29 6 Q32 6 32 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    {/* waves */}
    <path d="M6 31 Q9 28 13 31 Q17 34 21 31 Q25 28 29 31 Q33 34 38 31" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M6 37 Q9 34 13 37 Q17 40 21 37 Q25 34 29 37 Q33 40 38 37" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSauna = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    {/* bench */}
    <rect x="6" y="28" width="32" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <rect x="6" y="34" width="32" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    {/* person body */}
    <circle cx="22" cy="14" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M16 28 Q16 22 22 22 Q28 22 28 28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    {/* steam lines */}
    <path d="M13 7 Q14 5 13 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M22 7 Q23 5 22 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M31 7 Q32 5 31 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconMassage = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    {/* table */}
    <rect x="4" y="32" width="36" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    {/* person lying */}
    <circle cx="10" cy="27" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M14 29 L34 29" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    {/* therapist head */}
    <circle cx="34" cy="12" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    {/* therapist body + arm */}
    <path d="M34 16 L34 24" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M34 20 Q26 24 18 28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconBed = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="22" width="32" height="14" rx="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M6 22 L6 14 Q6 11 10 11 L34 11 Q38 11 38 14 L38 22" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <rect x="10" y="14" width="10" height="8" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <rect x="24" y="14" width="10" height="8" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="6" y1="30" x2="4" y2="36" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="38" y1="30" x2="40" y2="36" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
  </svg>
);

const IconBalcony = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="8" y="20" width="28" height="18" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="8" y1="20" x2="36" y2="20" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="16" y1="20" x2="16" y2="38" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="22" y1="20" x2="22" y2="38" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="28" y1="20" x2="28" y2="38" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M14 10 Q22 4 30 10" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <line x1="22" y1="4" x2="22" y2="20" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
  </svg>
);

const IconMinibar = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M18 6 L16 18 Q14 22 14 30 L14 38 Q14 40 16 40 L28 40 Q30 40 30 38 L30 30 Q30 22 28 18 L26 6 Z" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="14" y1="28" x2="30" y2="28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M20 6 L20 3 Q22 2 24 3 L24 6" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconWave = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <path d="M4 18 Q9 12 15 18 Q21 24 27 18 Q33 12 40 18" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M4 26 Q9 20 15 26 Q21 32 27 26 Q33 20 40 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M4 34 Q9 28 15 34 Q21 40 27 34 Q33 28 40 34" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSunbed = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="8" y="20" width="28" height="8" rx="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M8 24 L4 34" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M36 24 L40 34" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M8 20 L6 12 Q6 8 10 10 L20 16" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <circle cx="30" cy="12" r="5" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M30 7 L30 4" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M30 21 L30 24" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M23 12 L20 12" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M37 12 L40 12" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
  </svg>
);

const IconKayak = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <ellipse cx="22" cy="26" rx="18" ry="7" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="22" y1="8" x2="22" y2="44" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <ellipse cx="22" cy="8" rx="6" ry="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <ellipse cx="22" cy="44" rx="6" ry="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
  </svg>
);

const IconSUP = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect x="8" y="28" width="28" height="8" rx="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <circle cx="22" cy="18" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="22" y1="22" x2="22" y2="28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M22 14 L28 6 L32 8" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const ICON_MAP: Record<string, React.FC> = {
  pool: IconPool,
  sauna: IconSauna,
  massage: IconMassage,
  bed: IconBed,
  balcony: IconBalcony,
  minibar: IconMinibar,
  wave: IconWave,
  sunbed: IconSunbed,
  kayak: IconKayak,
  sup: IconSUP,
};

const SceneIcon: React.FC<{ iconType: string }> = ({ iconType }) => {
  const Icon = ICON_MAP[iconType];
  if (!Icon) return null;
  return <Icon />;
};

// ── POPUP CARD ─────────────────────────────────────────────────────────────
const PopupCardEl: React.FC<{
  iconType: string;
  label: string;
  appearFrame: number;
  localFrame: number;
  sceneOpacity: number;
  isLast: boolean;
}> = ({ iconType, label, appearFrame, localFrame, sceneOpacity, isLast }) => {
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const x = interpolate(progress, [0, 1], [-380, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]) * sceneOpacity;

  if (isLast) {
    // Last card: larger, centered horizontally, higher up
    return (
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: "50%",
          transform: `translateX(calc(-50% + ${x + 380}px))`,
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 22,
          background: "rgba(255,255,255,0.10)",
          border: "1.5px solid rgba(255,255,255,0.30)",
          borderRadius: 20,
          padding: "22px 48px 22px 32px",
          backdropFilter: "blur(8px)",
          minWidth: 320,
        }}
      >
        <SceneIcon iconType={iconType} />
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36,
            color: "#FFFFFF",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(255,255,255,0.10)",
        border: "1.5px solid rgba(255,255,255,0.28)",
        borderRadius: 16,
        padding: "18px 36px 18px 24px",
        marginBottom: 16,
        backdropFilter: "blur(8px)",
        width: "fit-content",
        minWidth: 280,
      }}
    >
      <SceneIcon iconType={iconType} />
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          color: "#FFFFFF",
          fontWeight: 500,
          letterSpacing: "0.03em",
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── BED OPTION CARD ────────────────────────────────────────────────────────
const BedOptionEl: React.FC<{
  iconType: string;
  label: string;
  appearFrame: number;
  localFrame: number;
  sceneOpacity: number;
}> = ({ iconType, label, appearFrame, localFrame, sceneOpacity }) => {
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const x = interpolate(progress, [0, 1], [-380, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]) * sceneOpacity;

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: "rgba(255,255,255,0.10)",
        border: "1.5px solid rgba(255,255,255,0.28)",
        borderRadius: 16,
        padding: "16px 32px 16px 22px",
        marginBottom: 14,
        backdropFilter: "blur(8px)",
        width: "fit-content",
        minWidth: 280,
      }}
    >
      <SceneIcon iconType={iconType} />
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 30,
          color: "#FFFFFF",
          fontWeight: 500,
          letterSpacing: "0.03em",
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── CTA URL CARD ───────────────────────────────────────────────────────────
const CtaUrlCard: React.FC<{
  url: string;
  localFrame: number;
  fadeIn: number;
  sceneOpacity: number;
}> = ({ url, localFrame, fadeIn, sceneOpacity }) => {
  const appearFrame = fadeIn + 55;
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pulse = 1 + 0.022 * Math.sin((localFrame - appearFrame) * 0.10);
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = progress * sceneOpacity;
  const glow = 0.55 + 0.45 * Math.abs(Math.sin((localFrame - appearFrame) * 0.07));

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: "50%",
        transform: `translateX(-50%) translateY(${y}px) scale(${pulse})`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.68)",
        border: `2px solid rgba(201,168,76,${glow})`,
        borderRadius: 12,
        padding: "20px 56px",
        boxShadow: `0 0 28px rgba(201,168,76,${glow * 0.45}), inset 0 0 14px rgba(201,168,76,0.07)`,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 38,
          color: "#C9A84C",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textShadow: `0 0 18px rgba(201,168,76,${glow * 0.7})`,
        }}
      >
        {url}
      </span>
    </div>
  );
};

// ── MAIN SCENE ─────────────────────────────────────────────────────────────
export const Scene: React.FC<SceneProps> = ({
  image,
  tag,
  title,
  sub,
  textPosition,
  startFrame,
  durationFrames,
  fadeIn = 20,
  fadeOut = 20,
  popupCards,
  bedOptions,
  ctaUrl,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > durationFrames) return null;

  const sceneOpacity = interpolate(
    localFrame,
    [0, fadeIn, durationFrames - fadeOut, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textStart = fadeIn;
  const tagDelay = 8;
  const titleDelay = tagDelay + 10;
  const subDelay = titleDelay + 14;
  const elementFadeFrames = 18;

  const tagOpacity = interpolate(
    localFrame,
    [textStart + tagDelay, textStart + tagDelay + elementFadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tagY = interpolate(
    localFrame,
    [textStart + tagDelay, textStart + tagDelay + elementFadeFrames],
    [18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const titleOpacity = interpolate(
    localFrame,
    [textStart + titleDelay, textStart + titleDelay + elementFadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const titleY = interpolate(
    localFrame,
    [textStart + titleDelay, textStart + titleDelay + elementFadeFrames],
    [22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subOpacity = interpolate(
    localFrame,
    [textStart + subDelay, textStart + subDelay + elementFadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    localFrame,
    [textStart + subDelay, textStart + subDelay + elementFadeFrames],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const lineWidth = interpolate(
    localFrame,
    [textStart + titleDelay + 4, textStart + titleDelay + elementFadeFrames + 12],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const imgScale = kenBurns(localFrame, durationFrames);

  const isOverlay = textPosition === "top-left-overlay";
  const isBottom =
    textPosition === "bottom" ||
    textPosition === "bottom-left" ||
    textPosition === "bottom-left-strong";

  const positions: Record<TextPosition, React.CSSProperties> = {
    top: { top: 100, left: 60, right: 60, alignItems: "flex-start" },
    "top-left": { top: 100, left: 60, right: "auto", alignItems: "flex-start" },
    "top-left-overlay": { top: 0, left: 0, right: 0, alignItems: "flex-start" },
    bottom: { bottom: 200, left: 60, right: 60, alignItems: "flex-start", top: "auto" },
    "bottom-left": { bottom: 200, left: 60, right: "auto", top: "auto", alignItems: "flex-start" },
    "bottom-left-strong": { bottom: 200, left: 60, right: "auto", top: "auto", alignItems: "flex-start" },
  };

  const posStyle = positions[textPosition];

  const titleShadow =
    textPosition === "bottom-left-strong"
      ? "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.9)"
      : "0 3px 16px rgba(0,0,0,0.75)";

  // popup cards: stagger 24f apart, start after all text visible + 8f
  const lastTextFrame = textStart + subDelay + elementFadeFrames;
  const popupStartFrame = lastTextFrame + 8;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* IMAGE */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imgScale})`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* OVERLAY for light-bg scenes */}
      {isOverlay && (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 100%)",
            height: "60%",
            bottom: "auto",
          }}
        />
      )}

      {/* DARK SCRIM */}
      {!isOverlay && (
        <>
          {(textPosition === "top" || textPosition === "top-left") && (
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.0) 45%)",
                height: "48%",
                bottom: "auto",
              }}
            />
          )}
          {isBottom && (
            <AbsoluteFill
              style={{
                background:
                  textPosition === "bottom-left-strong"
                    ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.0) 52%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.0) 45%)",
                top: "auto",
                height: "52%",
              }}
            />
          )}
        </>
      )}

      {/* TEXT BLOCK */}
      <AbsoluteFill
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: isBottom ? "flex-end" : "flex-start",
          ...posStyle,
          padding: isOverlay ? "80px 60px 0 60px" : undefined,
        }}
      >
        {/* TAG — for hero bottom position, tag goes AFTER title */}
        {textPosition !== "bottom-left" && textPosition !== "bottom" && (
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              letterSpacing: "0.25em",
              color: "#C9A84C",
              fontWeight: textPosition === "bottom-left-strong" ? 700 : 600,
              textTransform: "uppercase",
              marginBottom: 14,
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {tag}
          </div>
        )}

        {/* GOLDEN LINE */}
        <div
          style={{
            width: `${lineWidth}%`,
            height: 1.5,
            background: "linear-gradient(to right, #C9A84C, transparent)",
            marginBottom: 18,
            opacity: titleOpacity,
          }}
        />

        {/* TITLE */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 108,
            lineHeight: 1.0,
            color: "#FFFFFF",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            whiteSpace: "pre-line",
            textShadow: titleShadow,
            marginBottom: 22,
          }}
        >
          {title}
        </div>

        {/* TAG after title for bottom positions (hero) */}
        {(textPosition === "bottom-left" || textPosition === "bottom") && (
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              letterSpacing: "0.25em",
              color: "#C9A84C",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 14,
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {tag}
          </div>
        )}

        {/* SUB */}
        {sub && !popupCards && !bedOptions && (
          <div
            style={{
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              color: "#F5EDD6",
              fontWeight: 400,
              letterSpacing: "0.04em",
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              fontStyle: "italic",
            }}
          >
            {sub}
          </div>
        )}

        {/* BED OPTIONS */}
        {bedOptions && (
          <div style={{ marginTop: 8 }}>
            {bedOptions.map((opt, i) => (
              <BedOptionEl
                key={i}
                iconType={opt.iconType}
                label={opt.label}
                appearFrame={popupStartFrame + i * 24}
                localFrame={localFrame}
                sceneOpacity={sceneOpacity}
              />
            ))}
          </div>
        )}

        {/* POPUP CARDS — all except last rendered here in flow */}
        {popupCards && (
          <div style={{ marginTop: 8 }}>
            {popupCards.slice(0, -1).map((card, i) => (
              <PopupCardEl
                key={i}
                iconType={card.iconType}
                label={card.label}
                appearFrame={popupStartFrame + i * 24}
                localFrame={localFrame}
                sceneOpacity={sceneOpacity}
                isLast={false}
              />
            ))}
          </div>
        )}
      </AbsoluteFill>

      {/* LAST POPUP CARD — absolutely positioned, centered, larger */}
      {popupCards && popupCards.length > 0 && (() => {
        const last = popupCards[popupCards.length - 1];
        const lastAppear = popupStartFrame + (popupCards.length - 1) * 24;
        const progress = interpolate(
          localFrame,
          [lastAppear, lastAppear + 20],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const x = interpolate(progress, [0, 1], [-420, 0]);
        const opacity = interpolate(progress, [0, 1], [0, 1]) * sceneOpacity;
        return (
          <div
            style={{
              position: "absolute",
              bottom: 180,
              left: "50%",
              transform: `translateX(calc(-50% + ${x + 420}px))`,
              opacity,
              display: "flex",
              alignItems: "center",
              gap: 22,
              background: "rgba(255,255,255,0.10)",
              border: "1.5px solid rgba(255,255,255,0.30)",
              borderRadius: 20,
              padding: "22px 52px 22px 34px",
              backdropFilter: "blur(8px)",
              minWidth: 340,
            }}
          >
            <SceneIcon iconType={last.iconType} />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 38,
                color: "#FFFFFF",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              {last.label}
            </span>
          </div>
        );
      })()}

      {/* CTA URL CARD */}
      {ctaUrl && (
        <CtaUrlCard
          url={ctaUrl}
          localFrame={localFrame}
          fadeIn={fadeIn}
          sceneOpacity={sceneOpacity}
        />
      )}
    </AbsoluteFill>
  );
};
