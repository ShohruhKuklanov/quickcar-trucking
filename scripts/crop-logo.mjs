import sharp from "sharp";
import { rename } from "node:fs/promises";

const inputPath = process.argv[2] ?? "public/Quickcar_Web_Logo_Cropped.webp";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function bboxFromMask(maskBuffer, width, height) {
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

async function main() {
  const before = await sharp(inputPath).metadata();
  if (!before.width || !before.height) {
    throw new Error(`Unable to read image dimensions for ${inputPath}`);
  }

  const width = before.width;
  const height = before.height;

  // Build a robust alpha mask and crop based on it.
  // Some WebP exports contain a few fully-opaque stray pixels around the edges.
  // We reduce those with median filtering, then threshold the alpha channel.
  const candidates = [
    // Very aggressive: keep only fully-opaque alpha (helps remove anti-aliased edge haze)
    { median: 11, threshold: 254 },
    { median: 9, threshold: 254 },
    { median: 7, threshold: 254 },
    { median: 5, threshold: 254 },
    { median: 3, threshold: 254 },

    // Less aggressive fallbacks
    { median: 9, threshold: 252 },
    { median: 7, threshold: 252 },
    { median: 5, threshold: 252 },
    { median: 3, threshold: 252 },

    { median: 7, threshold: 250 },
    { median: 5, threshold: 250 },
    { median: 3, threshold: 250 },
    { median: 5, threshold: 240 },
    { median: 3, threshold: 240 },
  ];

  let best = null;
  const minWidth = Math.floor(width * 0.35);
  const minHeight = Math.floor(height * 0.35);

  for (const c of candidates) {
    const { data: mask, info } = await sharp(inputPath)
      .ensureAlpha()
      .extractChannel(3)
      .median(c.median)
      .threshold(c.threshold)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // mask is 1-channel
    const bbox = await bboxFromMask(mask, info.width, info.height);
    if (!bbox) continue;

    if (bbox.width < minWidth || bbox.height < minHeight) continue;

    // Skip if it basically didn't change anything.
    const area = bbox.width * bbox.height;
    const fullArea = width * height;

    // Prefer smallest meaningful crop.
    if (!best || area < best.area) {
      best = { ...bbox, area, median: c.median, threshold: c.threshold };
    }

    // Early-exit if we found a clearly tighter crop.
    if (area / fullArea < 0.9) break;
  }

  if (!best) {
    console.log("No non-transparent content found; no changes made.");
    process.exit(0);
  }

  // Add a tiny padding so antialiasing isn't cut off.
  const pad = 2;
  const left = clamp(best.minX - pad, 0, width - 1);
  const top = clamp(best.minY - pad, 0, height - 1);
  const right = clamp(best.maxX + pad, 0, width - 1);
  const bottom = clamp(best.maxY + pad, 0, height - 1);

  const cropW = right - left + 1;
  const cropH = bottom - top + 1;

  // If the crop is effectively the whole image, don't rewrite.
  if (cropW === width && cropH === height) {
    console.log(
      JSON.stringify(
        {
          inputPath,
          before: { width, height, hasAlpha: before.hasAlpha },
          decision: "already-tight",
          mask: { median: best.median, threshold: best.threshold },
        },
        null,
        2
      )
    );
    return;
  }

  const tmpPath = `${inputPath}.tmp.webp`;
  await sharp(inputPath)
    .extract({ left, top, width: cropW, height: cropH })
    .webp({ quality: 95 })
    .toFile(tmpPath);

  await rename(tmpPath, inputPath);

  const after = await sharp(inputPath).metadata();

  console.log(
    JSON.stringify(
      {
        inputPath,
        before: { width, height, hasAlpha: before.hasAlpha },
        crop: { left, top, width: cropW, height: cropH },
        mask: { median: best.median, threshold: best.threshold },
        after: { width: after.width, height: after.height, hasAlpha: after.hasAlpha },
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
