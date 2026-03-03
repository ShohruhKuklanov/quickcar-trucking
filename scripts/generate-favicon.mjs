import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2] ?? "public/logo 1.png";
const outputPaths = process.argv.slice(3);
const resolvedOutputPaths =
  outputPaths.length > 0 ? outputPaths : ["src/app/favicon.ico", "public/favicon.ico"];

const SIZES = [16, 32, 48, 64, 128, 256];

const ZOOM = (() => {
  const raw = Number.parseFloat(process.env.FAVICON_ZOOM ?? "1");
  if (!Number.isFinite(raw)) return 1;
  return clamp(raw, 1, 3);
})();

const PADDING_RATIO = (() => {
  const raw = Number.parseFloat(process.env.FAVICON_PADDING ?? "0.02");
  if (!Number.isFinite(raw)) return 0.02;
  return clamp(raw, 0, 0.3);
})();

const BG_MODE = (process.env.FAVICON_BG ?? "transparent").toLowerCase();
const BG =
  BG_MODE === "white"
    ? { r: 255, g: 255, b: 255, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 0 };

const CROP_MODE = (process.env.FAVICON_CROP_MODE ?? "largest").toLowerCase();

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

function largestComponentBboxFromMask(maskBuffer, width, height) {
  const visited = new Uint8Array(width * height);

  const stackX = new Int32Array(width * height);
  const stackY = new Int32Array(width * height);

  let best = null;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      const startIndex = rowOffset + x;
      if (visited[startIndex] || maskBuffer[startIndex] === 0) continue;

      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let area = 0;

      let sp = 0;
      stackX[sp] = x;
      stackY[sp] = y;
      sp++;
      visited[startIndex] = 1;

      while (sp > 0) {
        sp--;
        const cx = stackX[sp];
        const cy = stackY[sp];
        area++;

        if (cx < minX) minX = cx;
        if (cy < minY) minY = cy;
        if (cx > maxX) maxX = cx;
        if (cy > maxY) maxY = cy;

        // 4-connected neighbors
        if (cx > 0) {
          const ni = cy * width + (cx - 1);
          if (!visited[ni] && maskBuffer[ni] !== 0) {
            visited[ni] = 1;
            stackX[sp] = cx - 1;
            stackY[sp] = cy;
            sp++;
          }
        }
        if (cx + 1 < width) {
          const ni = cy * width + (cx + 1);
          if (!visited[ni] && maskBuffer[ni] !== 0) {
            visited[ni] = 1;
            stackX[sp] = cx + 1;
            stackY[sp] = cy;
            sp++;
          }
        }
        if (cy > 0) {
          const ni = (cy - 1) * width + cx;
          if (!visited[ni] && maskBuffer[ni] !== 0) {
            visited[ni] = 1;
            stackX[sp] = cx;
            stackY[sp] = cy - 1;
            sp++;
          }
        }
        if (cy + 1 < height) {
          const ni = (cy + 1) * width + cx;
          if (!visited[ni] && maskBuffer[ni] !== 0) {
            visited[ni] = 1;
            stackX[sp] = cx;
            stackY[sp] = cy + 1;
            sp++;
          }
        }
      }

      const bbox = { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
      if (!best || area > best.area) {
        best = { area, bbox };
      }
    }
  }

  return best?.bbox ?? null;
}

async function getTightCropRect(input) {
  const meta = await sharp(input).metadata();
  if (!meta.width || !meta.height) return null;

  // Work on a smaller mask for speed; scale coordinates back up.
  const targetMax = 512;
  const scale = Math.min(1, targetMax / Math.max(meta.width, meta.height));
  const scaledW = Math.max(1, Math.round(meta.width * scale));
  const scaledH = Math.max(1, Math.round(meta.height * scale));

  const { data: mask, info } = await sharp(input)
    .ensureAlpha()
    .resize(scaledW, scaledH)
    .extractChannel(3)
    // Keep antialiased edges; we just want to remove large empty padding.
    .threshold(8)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bbox =
    CROP_MODE === "all" ? bboxFromMask(mask, info.width, info.height) : largestComponentBboxFromMask(mask, info.width, info.height);
  if (!bbox) return null;

  // Minimal padding so edges don't get clipped.
  const pad = 0;

  const left = clamp(bbox.minX - pad, 0, info.width - 1);
  const top = clamp(bbox.minY - pad, 0, info.height - 1);
  const right = clamp(bbox.maxX + pad, 0, info.width - 1);
  const bottom = clamp(bbox.maxY + pad, 0, info.height - 1);

  const xScale = meta.width / info.width;
  const yScale = meta.height / info.height;

  const scaledLeft = clamp(Math.floor(left * xScale), 0, meta.width - 1);
  const scaledTop = clamp(Math.floor(top * yScale), 0, meta.height - 1);
  const scaledRight = clamp(Math.ceil((right + 1) * xScale) - 1, 0, meta.width - 1);
  const scaledBottom = clamp(Math.ceil((bottom + 1) * yScale) - 1, 0, meta.height - 1);

  const baseRect = {
    left: scaledLeft,
    top: scaledTop,
    width: scaledRight - scaledLeft + 1,
    height: scaledBottom - scaledTop + 1,
  };

  // Zoom in by shrinking the crop rect around its center.
  // This makes the favicon artwork occupy more of the final 16x16/32x32 area.
  if (ZOOM <= 1) return baseRect;

  const cx = baseRect.left + baseRect.width / 2;
  const cy = baseRect.top + baseRect.height / 2;
  const zoomW = baseRect.width / ZOOM;
  const zoomH = baseRect.height / ZOOM;

  const zLeft = clamp(Math.round(cx - zoomW / 2), 0, info.width - 1);
  const zTop = clamp(Math.round(cy - zoomH / 2), 0, info.height - 1);
  const zRight = clamp(Math.round(cx + zoomW / 2), 0, info.width - 1);
  const zBottom = clamp(Math.round(cy + zoomH / 2), 0, info.height - 1);

  return {
    left: zLeft,
    top: zTop,
    width: Math.max(1, zRight - zLeft + 1),
    height: Math.max(1, zBottom - zTop + 1),
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

      const inner = Math.max(1, Math.round(size * (1 - 2 * PADDING_RATIO)));

      const logoPng = await pipeline
        .resize(inner, inner, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      const left = Math.floor((size - inner) / 2);
      const top = Math.floor((size - inner) / 2);

      return sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: BG,
        },
      })
        .composite([
          {
            input: logoPng,
            left,
            top,
          },
        ])
        .png()
        .toBuffer();
    })
  );

  const icoBuffer = await pngToIco(pngBuffers);
  await Promise.all(resolvedOutputPaths.map((p) => writeFile(p, icoBuffer)));

  console.log(
    JSON.stringify(
      {
        inputPath,
        outputPaths: resolvedOutputPaths,
        sizes: SIZES,
        cropRect,
        zoom: ZOOM,
        paddingRatio: PADDING_RATIO,
        background: BG_MODE,
        cropMode: CROP_MODE,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
