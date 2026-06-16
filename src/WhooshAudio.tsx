import React from "react";
import { Audio, staticFile, useCurrentFrame } from "remotion";

interface WhooshAudioProps {
  atFrame: number;
  volume?: number;
}

export const WhooshAudio: React.FC<WhooshAudioProps> = ({
  atFrame,
  volume = 0.22,
}) => {
  const frame = useCurrentFrame();

  if (frame < atFrame) return null;

  return (
    <Audio
      src={staticFile("woosh-cinematic.mp3")}
      startFrom={0}
      delay={atFrame}
      volume={volume}
    />
  );
};
