import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('./public/icon.svg');
const publicDir = path.resolve('./public');

async function generateIcons() {
  if (!fs.existsSync(svgPath)) {
    console.error('Error: public/icon.svg does not exist. Please create it first.');
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate icon-192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Created public/icon-192.png');

  // 2. Generate icon-512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Created public/icon-512.png');

  // 3. Generate favicon.ico (32x32 PNG container readable by all modern browsers)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ Created public/favicon.ico');
}

generateIcons().catch(err => {
  console.error('Failed to generate icons:', err);
});
