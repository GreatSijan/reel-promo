import { Composition } from "remotion";
import { KrasnaKucaReel } from "./KrasnaKucaReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KrasnaKucaReel"
        component={KrasnaKucaReel}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
