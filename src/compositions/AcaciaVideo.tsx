import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Scene } from "../components/Scene";
import { WhooshAudio } from "../components/WhooshAudio";
import { copyHR } from "../data/copy.hr";
import { copyEN } from "../data/copy.en";

interface AcaciaVideoProps {
  lang: "hr" | "en";
}

const FADE_IN = 20;
const FADE_OUT = 20;
const GAP = 0;

// 9 scenes (wellness2 removed)
// scenes with popup cards get 160f, others 150f, CTA 170f
const SCENE_DURATIONS = [
  150, // 1. hero
  160, // 2. soba teal (bed options)
  160, // 3. soba plavo-zlatna (popup cards)
  160, // 4. wellness bazen (popup cards)
  150, // 5. restoran stol
  150, // 6. dorucak s pogledom
  160, // 7. plaza pticja (popup cards)
  150, // 8. plaza baldahini
  170, // 9. CTA panorama
];

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
export const TOTAL_FRAMES =
  START_FRAMES[START_FRAMES.length - 1] +
  SCENE_DURATIONS[SCENE_DURATIONS.length - 1];

// Whoosh fires just before each scene transition
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
          popupCards={(scene as any).popupCards}
          bedOptions={(scene as any).bedOptions}
          ctaUrl={(scene as any).ctaUrl}
        />
      ))}
    </AbsoluteFill>
  );
};
