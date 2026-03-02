import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2] ?? "public/logo 1.png";
const outputPaths = process.argv.slice(3);
const resolvedOutputPaths =
  outputPaths.length > 0 ? outputPaths : ["src/app/favicon.ico", "public/favicon.ico"];

const SIZES = [16, 32, 48, 64, 128, 256];

async function main() {
  await Promise.all(
    resolvedOutputPaths.map(async (p) => {
      await mkdir(path.dirname(p), { recursive: true });
    })
  );

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
  await Promise.all(resolvedOutputPaths.map((p) => writeFile(p, icoBuffer)));

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        inputPath,
        outputPaths: resolvedOutputPaths,
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
