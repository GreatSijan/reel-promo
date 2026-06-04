// ReelPromo.tsx
// Drop this into your Remotion project's src/ folder.
// Resolution: 1080x1920 (9:16 vertical), 30fps, 6 seconds = 180 frames

import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

// Helper: map frame range to 0–1 with easing
function anim(
  frame: number,
  fromFrame: number,
  toFrame: number,
  easing = Easing.out(Easing.cubic)
) {
  return interpolate(frame, [fromFrame, toFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export const ReelPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing in frames (30fps, 180 total)
  const introIn   = anim(frame, 0,   14);
  const taglineIn = anim(frame, 22,  40);
  const lineIn    = anim(frame, 32,  50);
  const card1In   = anim(frame, 50,  68);
  const card2In   = anim(frame, 64,  82);
  const card3In   = anim(frame, 78,  96);
  const ctaIn     = anim(frame, 110, 132);

  // Pulsing glow on CTA button
  const pulsePhase = (Math.sin((frame / fps) * Math.PI * 2.5) * 0.5 + 0.5) * ctaIn;

  // Slowly rotating gradient background
  const gradAngle = 140 + (frame / durationInFrames) * 30;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, serif",
        background: `linear-gradient(${gradAngle}deg, #0d0221 0%, #1a0535 40%, #0a1628 100%)`,
      }}
    >
      {/* Glow orb — top left */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(120,40,255,0.35) 0%, transparent 70%)",
          top: -200 + introIn * 60,
          left: -180,
          filter: "blur(60px)",
        }}
      />

      {/* Glow orb — bottom right */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,60,120,0.25) 0%, transparent 70%)",
          bottom: 100,
          right: -120,
          filter: "blur(60px)",
        }}
      />

      {/* Content container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 100px",
        }}
      >
        {/* Top label */}
        <div
          style={{
            opacity: introIn,
            transform: `translateY(${(1 - introIn) * 60}px)`,
            fontSize: 32,
            letterSpacing: "0.22em",
            color: "rgba(180,140,255,0.85)",
            textTransform: "uppercase",
            marginBottom: 48,
            fontFamily: "'Courier New', monospace",
          }}
        >
          ✦ Social Media Editing
        </div>

        {/* Headline line 1 */}
        <div
          style={{
            opacity: introIn,
            transform: `translateY(${(1 - introIn) * 80}px)`,
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Reels that
        </div>

        {/* Headline line 2 — gradient */}
        <div
          style={{
            opacity: introIn,
            transform: `translateY(${(1 - introIn) * 100}px)`,
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 60,
            background: "linear-gradient(90deg, #c77dff, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          stop the scroll.
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineIn,
            transform: `translateX(${(1 - taglineIn) * -60}px)`,
            fontSize: 42,
            color: "rgba(200,180,255,0.7)",
            lineHeight: 1.5,
            marginBottom: 80,
            maxWidth: 700,
          }}
        >
          Fast cuts, clean transitions, content your audience actually watches.
        </div>

        {/* Divider line */}
        <div
          style={{
            width: `${lineIn * 200}px`,
            height: 4,
            background: "linear-gradient(90deg, #c77dff, transparent)",
            marginBottom: 72,
          }}
        />

        {/* Feature rows */}
        {[
          { icon: "⚡", label: "Fast turnaround" },
          { icon: "🎬", label: "Reels & TikTok ready" },
          { icon: "✦",  label: "Custom style per brand" },
        ].map((item, i) => {
          const eachIn = [card1In, card2In, card3In][i];
          return (
            <div
              key={i}
              style={{
                opacity: eachIn,
                transform: `translateX(${(1 - eachIn) * 50}px)`,
                display: "flex",
                alignItems: "center",
                gap: 32,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "rgba(180,100,255,0.15)",
                  border: "2px solid rgba(180,100,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 42, color: "rgba(230,220,255,0.85)" }}>
                {item.label}
              </span>
            </div>
          );
        })}

        {/* CTA Button */}
        <div
          style={{
            marginTop: 80,
            opacity: ctaIn,
            transform: `translateY(${(1 - ctaIn) * 50}px) scale(${0.9 + ctaIn * 0.1})`,
            width: 700,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #9b5de5, #f72585)",
              borderRadius: 36,
              padding: "44px 0",
              textAlign: "center",
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#fff",
              textTransform: "uppercase",
              boxShadow: `0 0 ${60 + pulsePhase * 80}px rgba(180,80,255,${0.3 + pulsePhase * 0.4})`,
            }}
          >
            Book a free edit →
          </div>
        </div>
      </div>
    </div>
  );
};
