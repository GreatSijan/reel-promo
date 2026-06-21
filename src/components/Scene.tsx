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
  return interpolate(progress, [0, 1], [1.00, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const STROKE = "rgba(255,255,255,0.95)";
const SW = 1.8;

const IconPool = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <path d="M15 6 L15 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M29 6 L29 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="15" y1="13" x2="29" y2="13" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="15" y1="20" x2="29" y2="20" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M15 6 Q12 6 12 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M29 6 Q32 6 32 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M6 31 Q9 28 13 31 Q17 34 21 31 Q25 28 29 31 Q33 34 38 31" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M6 37 Q9 34 13 37 Q17 40 21 37 Q25 34 29 37 Q33 40 38 37" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSauna = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="28" width="32" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <rect x="6" y="34" width="32" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <circle cx="22" cy="14" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M16 28 Q16 22 22 22 Q28 22 28 28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M13 7 Q14 5 13 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M22 7 Q23 5 22 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M31 7 Q32 5 31 3" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconMassage = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <rect x="4" y="32" width="36" height="4" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <circle cx="10" cy="27" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M14 29 L34 29" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <circle cx="34" cy="12" r="4" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M34 16 L34 24" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M34 20 Q26 24 18 28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconBed = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <rect x="6" y="22" width="32" height="14" rx="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <path d="M6 22 L6 14 Q6 11 10 11 L34 11 Q38 11 38 14 L38 22" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <rect x="10" y="14" width="10" height="8" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <rect x="24" y="14" width="10" height="8" rx="2" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="6" y1="30" x2="4" y2="36" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <line x1="38" y1="30" x2="40" y2="36" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
  </svg>
);

const IconBalcony = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
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
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <path d="M18 6 L16 18 Q14 22 14 30 L14 38 Q14 40 16 40 L28 40 Q30 40 30 38 L30 30 Q30 22 28 18 L26 6 Z" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="14" y1="28" x2="30" y2="28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <path d="M20 6 L20 3 Q22 2 24 3 L24 6" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconWave = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <path d="M4 18 Q9 12 15 18 Q21 24 27 18 Q33 12 40 18" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M4 26 Q9 20 15 26 Q21 32 27 26 Q33 20 40 26" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
    <path d="M4 34 Q9 28 15 34 Q21 40 27 34 Q33 28 40 34" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSunbed = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
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
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
    <ellipse cx="22" cy="26" rx="18" ry="7" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <line x1="22" y1="8" x2="22" y2="44" stroke={STROKE} strokeWidth={SW} strokeLinecap="round"/>
    <ellipse cx="22" cy="8" rx="6" ry="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
    <ellipse cx="22" cy="44" rx="6" ry="3" stroke={STROKE} strokeWidth={SW} fill="none"/>
  </svg>
);

const IconSUP = () => (
  <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
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
};const Card: React.FC<{
  iconType: string;
  label: string;
  appearFrame: number;
  localFrame: number;
  sceneOpacity: number;
}> = ({ iconType, label, appearFrame, localFrame, sceneOpacity }) => {
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) }
  );
  const x = interpolate(progress, [0, 1], [-340, 0]);
  const opacity = progress * sceneOpacity;

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(13,27,42,0.70)",
        border: "0.5px solid rgba(201,168,76,0.40)",
        borderRadius: 14,
        padding: "16px 32px 16px 20px",
        marginBottom: 14,
        backdropFilter: "blur(14px)",
        width: "fit-content",
        minWidth: 260,
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
          textShadow: "0 1px 6px rgba(0,0,0,0.5)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const CtaUrlCard: React.FC<{
  url: string;
  localFrame: number;
  fadeIn: number;
  sceneOpacity: number;
}> = ({ url, localFrame, fadeIn, sceneOpacity }) => {
  const appearFrame = fadeIn + 55;
  const progress = interpolate(
    localFrame,
    [appearFrame, appearFrame + 28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) }
  );
  const pulse = 1 + 0.018 * Math.sin((localFrame - appearFrame) * 0.09);
  const y = interpolate(progress, [0, 1], [50, 0]);
  const opacity = progress * sceneOpacity;
  const glow = 0.5 + 0.5 * Math.abs(Math.sin((localFrame - appearFrame) * 0.06));

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
        background: "rgba(0,0,0,0.72)",
        border: `1.5px solid rgba(201,168,76,${glow})`,
        borderRadius: 10,
        padding: "18px 52px",
        boxShadow: `0 0 24px rgba(201,168,76,${glow * 0.35})`,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          color: "#C9A84C",
          fontWeight: 600,
          letterSpacing: "0.12em",
        }}
      >
        {url}
      </span>
    </div>
  );
};

function getScrim(textPosition: TextPosition): React.CSSProperties {
  switch (textPosition) {
    case "top":
    case "top-left":
      return {
        background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.30) 38%, rgba(0,0,0,0) 55%)",
        position: "absolute", top: 0, left: 0, right: 0, height: "60%",
      };
    case "top-left-overlay":
      return {
        background: "linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0) 65%)",
        position: "absolute", top: 0, left: 0, right: 0, height: "70%",
      };
    case "bottom-left":
      return {
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 40%, rgba(0,0,0,0) 58%)",
        position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
      };
    case "bottom-left-strong":
      return {
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 38%, rgba(0,0,0,0) 55%)",
        position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
      };
  }
}export const Scene: React.FC<SceneProps> = ({
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
  const TAG_DELAY = 6;
  const LINE_DELAY = TAG_DELAY + 12;
  const TITLE_DELAY = LINE_DELAY + 6;
  const SUB_DELAY = TITLE_DELAY + 16;
  const ELEM_DUR = 20;

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

  const tagProgress = interpolate(localFrame, [textStart + TAG_DELAY, textStart + TAG_DELAY + ELEM_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const lineProgress = interpolate(localFrame, [textStart + LINE_DELAY, textStart + LINE_DELAY + ELEM_DUR + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const titleProgress = interpolate(localFrame, [textStart + TITLE_DELAY, textStart + TITLE_DELAY + ELEM_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const subProgress = interpolate(localFrame, [textStart + SUB_DELAY, textStart + SUB_DELAY + ELEM_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const lastTextFrame = textStart + SUB_DELAY + ELEM_DUR;
  const cardsStart = lastTextFrame + 10;

  const isBottom = textPosition === "bottom-left" || textPosition === "bottom-left-strong";
  const imgScale = kenBurns(localFrame, durationFrames);
  const scrim = getScrim(textPosition);

  const textContainerStyle: React.CSSProperties = isBottom
    ? { position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 60px 200px 60px" }
    : { position: "absolute", top: 0, left: 0, right: 0, padding: "110px 60px 0 60px" };

  const titleShadow = textPosition === "bottom-left-strong"
    ? "0 2px 18px rgba(0,0,0,0.95), 0 0 32px rgba(0,0,0,0.85)"
    : "0 2px 14px rgba(0,0,0,0.80), 0 1px 4px rgba(0,0,0,0.60)";

  const cards = popupCards || bedOptions;

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
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

      <div style={scrim} />

      <div style={textContainerStyle}>
        <div
          style={{
            opacity: tagProgress * sceneOpacity,
            transform: `translateY(${interpolate(tagProgress, [0, 1], [14, 0])}px)`,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            letterSpacing: "0.28em",
            color: "#C9A84C",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: 16,
            textShadow: "0 1px 8px rgba(0,0,0,0.80)",
          }}
        >
          {tag}
        </div>

        <div
          style={{
            width: `${lineProgress * 100}%`,
            height: 1,
            background: "#C9A84C",
            marginBottom: 20,
            opacity: lineProgress * sceneOpacity,
          }}
        />

        <div
          style={{
            opacity: titleProgress * sceneOpacity,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [28, 0])}px)`,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 104,
            lineHeight: 1.0,
            color: "#FFFFFF",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            whiteSpace: "pre-line",
            textShadow: titleShadow,
            marginBottom: 24,
          }}
        >
          {title}
        </div>

        {sub && !cards && (
          <div
            style={{
              opacity: subProgress * sceneOpacity,
              transform: `translateY(${interpolate(subProgress, [0, 1], [14, 0])}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              color: "#F0EAD6",
              fontWeight: 400,
              letterSpacing: "0.04em",
              textShadow: "0 1px 10px rgba(0,0,0,0.80)",
              fontStyle: "italic",
            }}
          >
            {sub}
          </div>
        )}

        {cards && (
          <div style={{ marginTop: 4 }}>
            {cards.map((card, i) => (
              <Card
                key={i}
                iconType={card.iconType}
                label={card.label}
                appearFrame={cardsStart + i * 22}
                localFrame={localFrame}
                sceneOpacity={sceneOpacity}
              />
            ))}
          </div>
        )}
      </div>

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