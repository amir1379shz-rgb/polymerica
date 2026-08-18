# Favicon and icon generation

This repository includes SVG source files for the logo and favicon in `public/`.
To generate PNG/ICO files for broader browser support, run one of the following on your machine and commit the outputs into `public/`.

Using `resvg` (recommended, fast and high-quality):

1. Install `@resvg/resvg-js` or the CLI `resvg`.

npx resvg public/favicon.svg -w 16 -h 16 -o public/favicon-16.png
npx resvg public/favicon.svg -w 32 -h 32 -o public/favicon-32.png
npx resvg public/favicon.svg -w 96 -h 96 -o public/favicon-96.png
npx resvg public/favicon.svg -w 192 -h 192 -o public/favicon-192.png
npx resvg public/og-image.svg -w 1200 -h 630 -o public/og-image.png

Using ImageMagick (if installed):

convert public/favicon.svg -resize 16x16 public/favicon-16.png
convert public/favicon.svg -resize 32x32 public/favicon-32.png
convert public/favicon.svg -resize 96x96 public/favicon-96.png
convert public/favicon.svg -resize 192x192 public/favicon-192.png

To create an .ico file containing multiple sizes (16,32,48):

convert public/favicon-16.png public/favicon-32.png public/favicon-96.png public/favicon.ico

Add the generated files to git and push. Then reference them in your HTML:

<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="shortcut icon" href="/favicon.ico">
