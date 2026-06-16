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
  icon: string; // emoji or short symbol
  label: string;
}

export interface BedOption {
  icon: string;
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
  // popup cards slide in from left, one by one
  popupCards?: PopupCard[];
  // bed options for scene 2 soba1
  bedOptions?: BedOption[];
  // CTA URL card with gold border animation
  ctaUrl?: string;
}

function kenBurns(frame: number, duration: number) {
  const progress = frame / duration;
  return interpolate(progress, [0, 1], [1.04, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── POPUP CARD ─────────────────────────────────────────────────────────────
const PopupCardEl: React.FC<{
  icon: string;
  label: string;
  appearFrame: number;
  localFrame: number;
  sceneOpacity: number;
  index: number;
}> = ({ icon, label, appearFrame, localFrame, sceneOpacity, index }) => {
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const x = interpolate(progress, [0, 1], [-320, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity: opacity * sceneOpacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(0,0,0,0.62)",
        border: "1px solid rgba(201,168,76,0.45)",
        borderLeft: "3px solid #C9A84C",
        borderRadius: 6,
        padding: "14px 24px 14px 18px",
        marginBottom: 14,
        backdropFilter: "blur(4px)",
        width: "fit-content",
        minWidth: 260,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          color: "#F5EDD6",
          fontWeight: 500,
          letterSpacing: "0.03em",
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── BED OPTION CARD ────────────────────────────────────────────────────────
const BedOptionEl: React.FC<{
  icon: string;
  label: string;
  appearFrame: number;
  localFrame: number;
  sceneOpacity: number;
}> = ({ icon, label, appearFrame, localFrame, sceneOpacity }) => {
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const x = interpolate(progress, [0, 1], [-320, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity: opacity * sceneOpacity,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(201,168,76,0.35)",
        borderLeft: "3px solid #C9A84C",
        borderRadius: 6,
        padding: "10px 20px 10px 16px",
        marginBottom: 10,
        width: "fit-content",
        minWidth: 240,
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26,
          color: "#F5EDD6",
          fontWeight: 500,
          letterSpacing: "0.02em",
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
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
  durationFrames: number;
  fadeIn: number;
  fadeOut: number;
  sceneOpacity: number;
}> = ({ url, localFrame, durationFrames, fadeIn, fadeOut, sceneOpacity }) => {
  // appears after title, slides up from bottom-center
  const appearFrame = fadeIn + 60;
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // pulse: gentle scale oscillation
  const pulse = 1 + 0.025 * Math.sin((localFrame - appearFrame) * 0.12);
  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = progress * sceneOpacity;

  // gold border glow pulse
  const glow = 0.6 + 0.4 * Math.abs(Math.sin((localFrame - appearFrame) * 0.08));

  return (
    <div
      style={{
        position: "absolute",
        bottom: 220,
        left: "50%",
        transform: `translateX(-50%) translateY(${y}px) scale(${pulse})`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.70)",
        border: `2px solid rgba(201,168,76,${glow})`,
        borderRadius: 8,
        padding: "18px 48px",
        boxShadow: `0 0 24px rgba(201,168,76,${glow * 0.5}), inset 0 0 12px rgba(201,168,76,0.08)`,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          color: "#C9A84C",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textShadow: `0 0 16px rgba(201,168,76,${glow * 0.8})`,
        }}
      >
        {url}
      </span>
    </div>
  );
};

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

  // ── SCENE OPACITY ──────────────────────────────────────────────────────
  const sceneOpacity = interpolate(
    localFrame,
    [0, fadeIn, durationFrames - fadeOut, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── TEXT STAGGER ───────────────────────────────────────────────────────
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

  // ── IMAGE ──────────────────────────────────────────────────────────────
  const imgScale = kenBurns(localFrame, durationFrames);

  // ── POSITION STYLES ────────────────────────────────────────────────────
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
  const overlayGradient =
    "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)";

  // popup cards: each appears 22 frames apart, starting after text is visible
  const popupStartFrame = textStart + subDelay + elementFadeFrames + 8;

  // stronger text shadow for bottom-left-strong
  const titleShadow =
    textPosition === "bottom-left-strong"
      ? "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.9)"
      : "0 3px 16px rgba(0,0,0,0.75)";
  const tagShadow =
    textPosition === "bottom-left-strong"
      ? "0 2px 12px rgba(0,0,0,0.95)"
      : "0 2px 8px rgba(0,0,0,0.7)";

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
            background: overlayGradient,
            height: "55%",
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
                  "linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.0) 42%)",
                height: "45%",
                bottom: "auto",
              }}
            />
          )}
          {isBottom && (
            <AbsoluteFill
              style={{
                background:
                  textPosition === "bottom-left-strong"
                    ? "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.0) 48%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.0) 42%)",
                top: "auto",
                height: "50%",
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
        {/* TAG */}
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
            textShadow: tagShadow,
          }}
        >
          {tag}
        </div>

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

        {/* SUB — only if no popupCards and no bedOptions */}
        {sub && !popupCards && !bedOptions && (
          <div
            style={{
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
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
                icon={opt.icon}
                label={opt.label}
                appearFrame={popupStartFrame + i * 22}
                localFrame={localFrame}
                sceneOpacity={sceneOpacity}
              />
            ))}
          </div>
        )}

        {/* POPUP CARDS */}
        {popupCards && (
          <div style={{ marginTop: 8 }}>
            {popupCards.map((card, i) => (
              <PopupCardEl
                key={i}
                icon={card.icon}
                label={card.label}
                appearFrame={popupStartFrame + i * 24}
                localFrame={localFrame}
                sceneOpacity={sceneOpacity}
                index={i}
              />
            ))}
          </div>
        )}
      </AbsoluteFill>

      {/* CTA URL CARD */}
      {ctaUrl && (
        <CtaUrlCard
          url={ctaUrl}
          localFrame={localFrame}
          durationFrames={durationFrames}
          fadeIn={fadeIn}
          fadeOut={fadeOut}
          sceneOpacity={sceneOpacity}
        />
      )}
    </AbsoluteFill>
  );
};
