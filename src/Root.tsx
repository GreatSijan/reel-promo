import { Composition } from "remotion";
import { DuxiosPromoHR } from "./DuxiosPromoHR";
import { DuxiosPromoEN } from "./DuxiosPromoEN";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DuxiosPromoHR"
        component={DuxiosPromoHR}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="DuxiosPromoEN"
        component={DuxiosPromoEN}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
