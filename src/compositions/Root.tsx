import React from "react";
import { Composition } from "remotion";
import { AcaciaVideo, TOTAL_FRAMES } from "./compositions/AcaciaVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AcaciaHR"
        component={AcaciaVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "hr" }}
      />
      <Composition
        id="AcaciaEN"
        component={AcaciaVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "en" }}
      />
    </>
  );
};
