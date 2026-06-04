// Root.tsx
import { Composition } from "remotion";
import { DuxiosReel2 } from "./DuxiosReel2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DuxiosReel2"
        component={DuxiosReel2}
        durationInFrames={720}   // 24 sekundi na 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
