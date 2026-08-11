#!/usr/bin/env bash
#
# Turn a full-size screenshot into the responsive WebP + JPEG pair the site uses.
#
#   ./tools/optimize-image.sh images/my-new-project.png my-new-project
#
# Produces, in assets/img/projects/:
#   <slug>-640.webp   <slug>-640.jpg     (1x card)
#   <slug>-1280.webp  <slug>-1280.jpg    (2x retina)
#
# Then paste the printed <picture> block into the projects grid in index.html.
#
# Requires ImageMagick 7:  brew install imagemagick

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <source-image> <slug>" >&2
  echo "Example: $0 images/my-new-project.png my-new-project" >&2
  exit 1
fi

SRC="$1"
SLUG="$2"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/assets/img/projects"

if [ ! -f "$SRC" ]; then
  echo "Error: source image not found: $SRC" >&2
  exit 1
fi

command -v magick >/dev/null 2>&1 || { echo "Error: ImageMagick (magick) not found." >&2; exit 1; }

mkdir -p "$OUT"

for W in 640 1280; do
  magick "$SRC" -resize "${W}x" -strip -quality 82 "$OUT/${SLUG}-${W}.jpg"
  magick "$SRC" -resize "${W}x" -strip -quality 78 -define webp:method=6 "$OUT/${SLUG}-${W}.webp"
done

# Intrinsic size of the 1x file, used for width/height so the card never shifts.
read -r IW IH < <(magick identify -format "%w %h" "$OUT/${SLUG}-640.jpg")

echo ""
echo "Created:"
ls -1sh "$OUT/${SLUG}"-*.{jpg,webp} | sed 's/^/  /'
echo ""
echo "Markup — paste inside a new <article class=\"card card--work reveal\" data-category=\"…\">:"
echo ""
cat <<HTML
              <picture>
                <source type="image/webp" srcset="assets/img/projects/${SLUG}-640.webp 640w, assets/img/projects/${SLUG}-1280.webp 1280w" sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw">
                <img src="assets/img/projects/${SLUG}-640.jpg" srcset="assets/img/projects/${SLUG}-640.jpg 640w, assets/img/projects/${SLUG}-1280.jpg 1280w" sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw" alt="DESCRIBE THE SCREENSHOT" width="${IW}" height="${IH}" loading="lazy" decoding="async">
              </picture>
HTML
echo ""
echo "Remember to bump the filter counts and the 'Live projects' stat in index.html."
