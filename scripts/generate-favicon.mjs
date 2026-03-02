import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2] ?? "public/logo 1.png";
const outputPaths = process.argv.slice(3);
const resolvedOutputPaths =
  outputPaths.length > 0 ? outputPaths : ["src/app/favicon.ico", "public/favicon.ico"];

const SIZES = [16, 32, 48, 64, 128, 256];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function bboxFromMask(maskBuffer, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (maskBuffer[rowOffset + x] !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function getTightCropRect(input) {
  const meta = await sharp(input).metadata();
  if (!meta.width || !meta.height) return null;

  const { data: mask, info } = await sharp(input)
    .ensureAlpha()
    .extractChannel(3)
    // Keep antialiased edges; we just want to remove large empty padding.
    .threshold(8)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bbox = bboxFromMask(mask, info.width, info.height);
  if (!bbox) return null;

  // Small padding so edges don't get clipped.
  const pad = Math.max(2, Math.round(Math.min(info.width, info.height) * 0.01));

  const left = clamp(bbox.minX - pad, 0, info.width - 1);
  const top = clamp(bbox.minY - pad, 0, info.height - 1);
  const right = clamp(bbox.maxX + pad, 0, info.width - 1);
  const bottom = clamp(bbox.maxY + pad, 0, info.height - 1);

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

async function main() {
  await Promise.all(
    resolvedOutputPaths.map(async (p) => {
      await mkdir(path.dirname(p), { recursive: true });
    })
  );

  const cropRect = await getTightCropRect(inputPath);

  const pngBuffers = await Promise.all(
    SIZES.map(async (size) => {
      let pipeline = sharp(inputPath).ensureAlpha();
      if (cropRect) pipeline = pipeline.extract(cropRect);

      return pipeline
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    })
  );

  const icoBuffer = await pngToIco(pngBuffers);
  await Promise.all(resolvedOutputPaths.map((p) => writeFile(p, icoBuffer)));

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        inputPath,
        outputPaths: resolvedOutputPaths,
        sizes: SIZES,
        cropRect,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
