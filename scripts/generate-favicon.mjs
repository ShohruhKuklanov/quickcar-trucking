import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2] ?? "public/logo 1.png";
const outputPath = process.argv[3] ?? "src/app/favicon.ico";

const SIZES = [16, 32, 48, 64, 128, 256];

async function main() {
  const outputDir = path.dirname(outputPath);
  await mkdir(outputDir, { recursive: true });

  const pngBuffers = await Promise.all(
    SIZES.map(async (size) => {
      return sharp(inputPath)
        .ensureAlpha()
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    })
  );

  const icoBuffer = await pngToIco(pngBuffers);
  await writeFile(outputPath, icoBuffer);

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        inputPath,
        outputPath,
        sizes: SIZES,
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
