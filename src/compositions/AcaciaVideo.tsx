import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Scene } from "../components/Scene";
import { WhooshAudio } from "../components/WhooshAudio";
import { copyHR } from "../data/copy.hr";
import { copyEN } from "../data/copy.en";

interface AcaciaVideoProps {
  lang: "hr" | "en";
}

// ── TIMING CONFIGURATION ──────────────────────────────────────────────────────
// Each scene:  fadeIn=20f  readable_core=XX  fadeOut=20f
// Gap between scenes = 0 (fade out of scene N overlaps with fade in of scene N+1)
// This means: at frame (sceneStart + duration - fadeOut), the scene starts fading out.
// The NEXT scene starts at exactly that same frame → simultaneous crossfade.
// But here we do a clean CUT with gap so there's NEVER overlap: scene fully black → new scene.
// Gap = 0 → scenes touch exactly when both are at opacity 0.

const FADE_IN = 20;
const FADE_OUT = 20;
const GAP = 0; // frames of black between scenes (0 = seamless but clean)

// Scene durations (total including fade in + readable time + fade out)
// Hero longer, other scenes ~110-120, CTA 140
const SCENE_DURATIONS = [
  130, // 1. hero
  110, // 2. soba teal
  110, // 3. soba plavo-zlatna
  110, // 4. wellness uski kadar
  110, // 5. wellness siroki
  110, // 6. restoran stol
  110, // 7. dorucak s pogledom
  110, // 8. plaza ptičja perspektiva
  110, // 9. plaza baldahini
  140, // 10. CTA panorama
];

// Build cumulative start frames
function buildStartFrames(durations: number[], gap: number): number[] {
  const starts: number[] = [];
  let cursor = 0;
  for (const dur of durations) {
    starts.push(cursor);
    cursor += dur + gap;
  }
  return starts;
}

const START_FRAMES = buildStartFrames(SCENE_DURATIONS, GAP);
export const TOTAL_FRAMES = START_FRAMES[START_FRAMES.length - 1] + SCENE_DURATIONS[SCENE_DURATIONS.length - 1];

// Whoosh fires a few frames before each scene transition (when fadeout starts)
const WHOOSH_FRAMES = START_FRAMES.slice(1).map(
  (start, i) => START_FRAMES[i] + SCENE_DURATIONS[i] - FADE_OUT - 4
);

export const AcaciaVideo: React.FC<AcaciaVideoProps> = ({ lang }) => {
  const copy = lang === "hr" ? copyHR : copyEN;
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Background music */}
      <Audio
        src={staticFile("In alto mare (2022 Remastered).mp3")}
        startFrom={0}
        volume={(f) => {
          // Fade out in last 60 frames
          if (f > TOTAL_FRAMES - 60) {
            return Math.max(0, (TOTAL_FRAMES - f) / 60) * 0.55;
          }
          return 0.55;
        }}
      />

      {/* Whoosh on each transition */}
      {WHOOSH_FRAMES.map((wf, i) => (
        <WhooshAudio key={i} atFrame={wf} />
      ))}

      {/* Scenes */}
      {copy.scenes.map((scene, i) => (
        <Scene
          key={scene.id}
          image={scene.image}
          tag={scene.tag}
          title={scene.title}
          sub={scene.sub}
          textPosition={scene.textPosition as any}
          startFrame={START_FRAMES[i]}
          durationFrames={SCENE_DURATIONS[i]}
          fadeIn={FADE_IN}
          fadeOut={FADE_OUT}
        />
      ))}
    </AbsoluteFill>
  );
};
