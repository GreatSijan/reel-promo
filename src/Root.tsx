import { Composition } from "remotion";
import { AcaciaReel } from "./AcaciaReel";

const FPS = 30;
const S1 = 300;
const S2 = 160;
const S3 = 160;
const S4 = 160;
const S5 = 140;
const TOTAL = S1 + S2 + S3 + S4 + S5; // 920 frames ≈ 30.7s

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AcaciaReel"
      component={AcaciaReel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
