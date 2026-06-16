import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

export type TextPosition =
  | "top"
  | "top-left"
  | "bottom"
  | "bottom-left"
  | "top-left-overlay";

interface SceneProps {
  image: string;
  tag: string;
  title: string;
  sub: string;
  textPosition: TextPosition;
  /** frame at which this scene starts (relative to composition start) */
  startFrame: number;
  /** total duration of this scene in frames */
  durationFrames: number;
  /** frames for fade-in at start */
  fadeIn?: number;
  /** frames for fade-out at end — ALL elements fade together */
  fadeOut?: number;
}

// Ken Burns: slow zoom in
function kenBurns(frame: number, duration: number) {
  const progress = frame / duration;
  const scale = interpolate(progress, [0, 1], [1.04, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return scale;
}

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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Local frame within this scene
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > durationFrames) return null;

  // ── SCENE-LEVEL OPACITY (fade in / fade out together) ──────────────────
  // Everything fades in together at scene start
  const sceneOpacity = interpolate(
    localFrame,
    [0, fadeIn, durationFrames - fadeOut, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── TEXT STAGGER (relative to scene fade-in) ───────────────────────────
  // Tag appears first, then title, then sub — all WITHIN the scene opacity envelope
  // They stagger their own opacity on top of scene opacity
  const tagDelay = 8;
  const titleDelay = tagDelay + 10;
  const subDelay = titleDelay + 14;
  const elementFadeFrames = 18;

  // How far into scene's "readable" window are we?
  const textStart = fadeIn; // text starts appearing as scene fully fades in

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

  // ── LINE REVEAL ────────────────────────────────────────────────────────
  const lineWidth = interpolate(
    localFrame,
    [textStart + titleDelay + 4, textStart + titleDelay + elementFadeFrames + 12],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── IMAGE SCALE (Ken Burns) ─────────────────────────────────────────────
  const imgScale = kenBurns(localFrame, durationFrames);

  // ── TEXT POSITION LOGIC ────────────────────────────────────────────────
  const positions: Record<TextPosition, React.CSSProperties> = {
    top: {
      top: 100,
      left: 60,
      right: 60,
      alignItems: "flex-start",
    },
    "top-left": {
      top: 100,
      left: 60,
      right: "auto",
      alignItems: "flex-start",
    },
    "top-left-overlay": {
      top: 0,
      left: 0,
      right: 0,
      alignItems: "flex-start",
      // special overlay handled below
    },
    bottom: {
      bottom: 180,
      left: 60,
      right: 60,
      alignItems: "flex-start",
      top: "auto",
    },
    "bottom-left": {
      bottom: 180,
      left: 60,
      right: "auto",
      top: "auto",
      alignItems: "flex-start",
    },
  };

  const posStyle = positions[textPosition];
  const isOverlay = textPosition === "top-left-overlay";

  // Overlay gradient for light images (sobe scenes)
  const overlayGradient =
    "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)";

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* ── IMAGE ── */}
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

      {/* ── OVERLAY for light-background scenes ── */}
      {isOverlay && (
        <AbsoluteFill
          style={{
            background: overlayGradient,
            height: "55%",
            bottom: "auto",
          }}
        />
      )}

      {/* ── DARK SCRIM for text readability (non-overlay scenes) ── */}
      {!isOverlay && (
        <>
          {(textPosition === "top" || textPosition === "top-left") && (
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 38%)",
                height: "40%",
                bottom: "auto",
              }}
            />
          )}
          {(textPosition === "bottom" || textPosition === "bottom-left") && (
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.0) 38%)",
                top: "auto",
                height: "40%",
              }}
            />
          )}
        </>
      )}

      {/* ── TEXT BLOCK ── */}
      <AbsoluteFill
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            textPosition === "bottom" || textPosition === "bottom-left"
              ? "flex-end"
              : "flex-start",
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
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 14,
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
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
            textShadow: "0 3px 16px rgba(0,0,0,0.75)",
            marginBottom: 22,
          }}
        >
          {title}
        </div>

        {/* SUB */}
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
