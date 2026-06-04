// api/render.ts
// Vercel Serverless Function za renderiranje Remotion videa

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Bundle projekt
    const bundled = await bundle({
      entryPoint: path.resolve("./src/index.ts"),
      webpackOverride: (config) => config,
    });

    // Odaberi kompoziciju
    const composition = await selectComposition({
      serveUrl: bundled,
      id: "DuxiosReel2",
    });

    // Output path
    const outputPath = path.resolve(`/tmp/video-${Date.now()}.mp4`);

    // Renderiraj
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
    });

    // Pošalji video kao response
    const videoBuffer = fs.readFileSync(outputPath);
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=duxios-reel.mp4");
    res.send(videoBuffer);

    // Cleanup
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
