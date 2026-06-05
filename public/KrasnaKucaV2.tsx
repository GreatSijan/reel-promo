import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

// Identical scenes to V1 — copy paste Scene1-5 components here
// Only difference: no cinematic-impact-hit audio

function easeIn(frame: number, start: number, dur: number) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t,
  });
}

function easeOut(frame: number, start: number, dur: number) {
  return interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) * (1 - t),
  });
}

function reveal(frame: number, start: number) {
  return spring({ frame: frame - start, fps: 30, config: { damping: 20, stiffness: 80, mass: 1 } });
}

const PhotoBG: React.FC<{
  src: string;
  frame: number;
  sceneStart: number;
  sceneEnd: number;
  zoomDir?: "in" | "out";
  overlayOpacity?: number;
}> = ({ src, frame, sceneStart, sceneEnd, zoomDir = "in", overlayOpacity = 0.52 }) => {
  const local = frame - sceneStart;
  const dur = sceneEnd - sceneStart;
  const fadeIn = easeIn(frame, sceneStart, 22);
  const fadeOut = frame > sceneEnd - 25 ? easeOut(frame, sceneEnd - 25, 25) : 1;
  const opacity = Math.min(fadeIn, fadeOut);
  const zoom = interpolate(local, [0, dur], zoomDir === "in" ? [1.06, 1.0] : [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
      />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.7) 100%)`,
        opacity: overlayOpacity,
      }} />
    </AbsoluteFill>
  );
};

const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const tagOp = easeIn(local, 18, 20);
  const tagX = interpolate(reveal(local, 18), [0, 1], [-40, 0]);
  const h1Op = easeIn(local, 32, 22);
  const h1Y = interpolate(reveal(local, 32), [0, 1], [50, 0]);
  const h2Op = easeIn(local, 50, 22);
  const h2Y = interpolate(reveal(local, 50), [0, 1], [50, 0]);
  const ratingOp = easeIn(local, 72, 20);

  return (
    <AbsoluteFill>
      <PhotoBG src="aerial-night.jpg" frame={frame} sceneStart={0} sceneEnd={135} zoomDir="out" overlayOpacity={1} />
      <AbsoluteFill style={{ padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, transform: `translateX(${tagX}px)`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 1.5, background: "#D4A853" }} />
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 18, letterSpacing: "5px", textTransform: "uppercase", color: "#D4A853" }}>Labin · Istra · Hrvatska</span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px" }}>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 96, fontWeight: 700, color: "#FAFAF5", lineHeight: 1.0, textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>Vaš privatni</div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 96, fontWeight: 700, color: "#D4A853", lineHeight: 1.0, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>raj u Istri.</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 80px", opacity: ratingOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ background: "#D4A853", color: "#0A0A0A", fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, padding: "10px 18px", borderRadius: 4 }}>9.7</div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#FAFAF5" }}>Izuzetan</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#A09070", letterSpacing: "2px" }}>16 recenzija · Booking.com</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 120;
  const tagOp = easeIn(local, 20, 18);
  const h1Op = easeIn(local, 34, 20);
  const h1Y = interpolate(reveal(local, 34), [0, 1], [45, 0]);
  const h2Op = easeIn(local, 50, 20);
  const h2Y = interpolate(reveal(local, 50), [0, 1], [45, 0]);
  const feat1Op = easeIn(local, 68, 18);
  const feat2Op = easeIn(local, 82, 18);

  return (
    <AbsoluteFill>
      <PhotoBG src="pool-olive.jpg" frame={frame} sceneStart={120} sceneEnd={255} zoomDir="in" overlayOpacity={1} />
      <AbsoluteFill style={{ padding: "0 60px", display: "flex", alignItems: "center" }}>
        <div style={{ width: 3, height: interpolate(local, [15, 50], [0, 220], { extrapolateRight: "clamp" }), background: "#D4A853", borderRadius: 2, marginRight: 36, flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ opacity: tagOp, fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: "5px", color: "#D4A853", textTransform: "uppercase", marginBottom: 20 }}>Privatni bazen</div>
          <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 86, fontWeight: 700, color: "#FAFAF5", lineHeight: 0.95, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>Samo</div>
          <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 86, fontWeight: 700, color: "#D4A853", lineHeight: 0.95, textShadow: "0 4px 24px rgba(0,0,0,0.5)", marginBottom: 40 }}>za vas.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[{ text: "Morska voda · Grijani bazen", op: feat1Op }, { text: "Ležaljke · Suncobrani · Mir", op: feat2Op }].map((f) => (
              <div key={f.text} style={{ opacity: f.op, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A853", flexShrink: 0 }} />
                <span style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "rgba(250,250,245,0.88)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 240;
  const topOp = easeIn(local, 16, 20);
  const h1Op = easeIn(local, 30, 20);
  const h1Y = interpolate(reveal(local, 30), [0, 1], [40, 0]);
  const subOp = easeIn(local, 48, 20);
  const pills = [
    { label: "2 spavaće sobe", op: easeIn(local, 62, 16) },
    { label: "Do 5 gostiju", op: easeIn(local, 74, 16) },
    { label: "Kamin · AC · WiFi", op: easeIn(local, 86, 16) },
  ];

  return (
    <AbsoluteFill>
      <PhotoBG src="living-room.jpg" frame={frame} sceneStart={240} sceneEnd={360} zoomDir="out" overlayOpacity={1} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 90px" }}>
        <div style={{ opacity: topOp, fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: "5px", color: "#D4A853", textTransform: "uppercase", marginBottom: 18 }}>Interijer</div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 78, fontWeight: 700, color: "#FAFAF5", lineHeight: 1.0, textShadow: "0 4px 28px rgba(0,0,0,0.8)", marginBottom: 16 }}>
          Osjećaj doma,<br /><span style={{ color: "#D4A853" }}>daleko od njega.</span>
        </div>
        <div style={{ opacity: subOp, fontFamily: "Georgia, serif", fontSize: 22, color: "rgba(250,250,245,0.75)", marginBottom: 30 }}>Cijela vila — samo vaša</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {pills.map((p) => (
            <div key={p.label} style={{ opacity: p.op, border: "1px solid rgba(212,168,83,0.6)", borderRadius: 40, padding: "10px 22px", fontFamily: "Georgia, serif", fontSize: 18, color: "#D4A853", backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.25)" }}>{p.label}</div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 345;
  const tagOp = easeIn(local, 14, 18);
  const h1Op = easeIn(local, 26, 20);
  const h1Y = interpolate(reveal(local, 26), [0, 1], [40, 0]);
  const subOp = easeIn(local, 46, 18);
  const quoteOp = easeIn(local, 62, 20);

  return (
    <AbsoluteFill>
      <PhotoBG src="bbq-terrace.jpg" frame={frame} sceneStart={345} sceneEnd={450} zoomDir="in" overlayOpacity={1} />
      <AbsoluteFill style={{ padding: "70px 60px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ opacity: tagOp, display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 30, height: 1.5, background: "#D4A853" }} />
          <span style={{ fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: "5px", color: "#D4A853", textTransform: "uppercase" }}>Vanjska terasa</span>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 80, fontWeight: 700, color: "#FAFAF5", lineHeight: 1.0, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>
          Večere koje<br /><span style={{ color: "#D4A853" }}>pamtite.</span>
        </div>
        <div style={{ opacity: subOp, marginTop: 22, fontFamily: "Georgia, serif", fontSize: 22, color: "rgba(250,250,245,0.8)", lineHeight: 1.6 }}>
          Roštilj · Vanjska blagovaonica<br />Vrt · Istarska noć
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 60px 80px", opacity: quoteOp }}>
        <div style={{ borderLeft: "3px solid #D4A853", paddingLeft: 24 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "rgba(250,250,245,0.85)", fontStyle: "italic", lineHeight: 1.5 }}>„Toplo preporučujemo svima koji žele<br />miran i ugodan odmor."</div>
          <div style={{ marginTop: 10, fontFamily: "Georgia, serif", fontSize: 15, color: "#D4A853", letterSpacing: "2px" }}>— Ante ★★★★★</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 435;
  const logoOp = easeIn(local, 14, 22);
  const h1Op = easeIn(local, 28, 22);
  const h1Y = interpolate(reveal(local, 28), [0, 1], [45, 0]);
  const h2Op = easeIn(local, 46, 22);
  const h2Y = interpolate(reveal(local, 46), [0, 1], [45, 0]);
  const ctaOp = easeIn(local, 64, 22);
  const ctaScale = interpolate(reveal(local, 64), [0, 1], [0.88, 1]);
  const pulse = 1 + interpolate(Math.sin((local / 28) * Math.PI), [-1, 1], [-0.02, 0.02]);

  return (
    <AbsoluteFill>
      <PhotoBG src="facade-night.jpg" frame={frame} sceneStart={435} sceneEnd={540} zoomDir="out" overlayOpacity={1} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px", textAlign: "center" }}>
        <div style={{ opacity: logoOp, marginBottom: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 60, height: 1.5, background: "#D4A853" }} />
          <span style={{ fontFamily: "Georgia, serif", fontSize: 16, letterSpacing: "7px", color: "#D4A853", textTransform: "uppercase" }}>Krasna kuća Istra</span>
          <div style={{ width: 60, height: 1.5, background: "#D4A853" }} />
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 88, fontWeight: 700, color: "#FAFAF5", lineHeight: 1.0, textShadow: "0 6px 32px rgba(0,0,0,0.7)" }}>Vaše ljeto</div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Y}px)`, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 88, fontWeight: 700, color: "#D4A853", lineHeight: 1.0, textShadow: "0 6px 32px rgba(0,0,0,0.5)", marginBottom: 52 }}>počinje ovdje.</div>
        <div style={{ opacity: ctaOp, transform: `scale(${ctaScale * pulse})`, background: "#D4A853", color: "#0A0A0A", fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, padding: "20px 52px", borderRadius: 4, letterSpacing: "3px", textTransform: "uppercase" }}>
          Rezervirajte · Booking.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── MAIN — V2 (without cinematic hit) ───────────────────────────────────────
export const KrasnaKucaV2: React.FC = () => {
  const frame = useCurrentFrame();

  const musicFadeInDur = 30;
  const musicFadeOutStart = 540 - 40;
  const musicVol = interpolate(
    frame,
    [0, musicFadeInDur, musicFadeOutStart, 540],
    [0, 0.82, 0.82, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const whooshFrames = [118, 238, 343, 433];

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <Audio
        src={staticFile("In alto mare (2022 Remastered).mp3")}
        startFrom={52 * 30}
        volume={musicVol}
      />

      {whooshFrames.map((wf) =>
        frame >= wf && frame < wf + 25 ? (
          <Audio key={wf} src={staticFile("woosh-cinematic.mp3")} startFrom={0} endAt={25} volume={0.45} />
        ) : null
      )}

      {frame < 140 && <Scene1 frame={frame} />}
      {frame >= 118 && frame < 260 && <Scene2 frame={frame} />}
      {frame >= 238 && frame < 365 && <Scene3 frame={frame} />}
      {frame >= 343 && frame < 455 && <Scene4 frame={frame} />}
      {frame >= 433 && <Scene5 frame={frame} />}
    </AbsoluteFill>
  );
};
