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

// Timing logic:
// fadeIn(20) + tag(8+18) + title(18+18) + sub/lastCard(32+18) + 45f mirovanje + fadeOut(20)
// Scenes with popup cards (3 cards, last at popupStart + 2*24 = +48f after text):
//   20 + 26 + 28 + 32+18 + 48 + 45 + 20 = ~237 → rounded to 200f (generous but not excessive)
// Scenes without cards:
//   20 + 26 + 28 + 50 + 45 + 20 = ~189 → 170f
// Hero and CTA slightly different

const SCENE_DURATIONS = [
  160, // 1. hero
  200, // 2. soba teal (bed options x3)
  200, // 3. soba plavo-zlatna (popup cards x3)
  200, // 4. wellness bazen (popup cards x3)
  170, // 5. restoran stol
  170, // 6. dorucak s pogledom
  200, // 7. plaza pticja (popup cards x3)
  170, // 8. plaza baldahini
  190, // 9. CTA panorama
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

const WHOOSH_FRAMES = START_FRAMES.slice(1).map(
  (start, i) => START_FRAMES[i] + SCENE_DURATIONS[i] - FADE_OUT - 4
);

export const AcaciaVideo: React.FC<AcaciaVideoProps> = ({ lang }) => {
  const copy = lang === "hr" ? copyHR : copyEN;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
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

      {WHOOSH_FRAMES.map((wf, i) => (
        <WhooshAudio key={i} atFrame={wf} />
      ))}

      {copy.scenes.map((scene, i) => (
        <Scene
          key={scene.id}
          image={scene.image}
          tag={scene.tag}
          title={scene.title}
          sub={(scene as any).sub}
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
