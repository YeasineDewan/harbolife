import sharp from 'sharp';
import path from 'path';

const imagePath = 'D:/iti/React-2025/Project/project/Mobile/src/assets/signup.webp';

async function getPixelColor() {
  try {
    const image = sharp(imagePath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Read top-left pixel (pixel 0,0)
    const r = data[0];
    const g = data[1];
    const b = data[2];

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    console.log(`RGB: rgb(${r}, ${g}, ${b})`);
    console.log(`HEX: ${rgbToHex(r, g, b)}`);
  } catch (err) {
    console.error('Error reading image:', err.message);
  }
}

getPixelColor();
