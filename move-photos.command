#!/bin/bash
# Dose website: Downloads madhle original photos images/ folder madhe halavto
cd "$(dirname "$0")"
mkdir -p images
n=0
for f in ~/Downloads/dose-*.jpg; do
  [ -e "$f" ] || continue
  name=$(basename "$f" | sed -E 's/ \([0-9]+\)//')
  mv -f "$f" "images/$name" && n=$((n+1))
done
echo "$n photos images/ folder madhe halavle."
ls images
