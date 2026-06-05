import { Composition } from "remotion";
import { KrasnaKucaV1 } from "./KrasnaKucaV1";
import { KrasnaKucaV2 } from "./KrasnaKucaV2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KrasnaKucaV1"
        component={KrasnaKucaV1}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KrasnaKucaV2"
        component={KrasnaKucaV2}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
