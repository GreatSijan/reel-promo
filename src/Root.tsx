import { Composition } from "remotion";
import { VillaMilanaReel } from "./VillaMilanaReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VillaMilanaReel"
        component={VillaMilanaReel}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
