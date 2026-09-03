#!/usr/bin/env bash
# Baut aus den Bausteinen in src/ zwei Fassungen:
#   rotes-regal.html            – Fragment für den Artifact-Dienst (ohne doctype/head/body)
#   rotes-regal-standalone.html – vollständiges Dokument, lokal im Browser zu öffnen
set -euo pipefail
cd "$(dirname "$0")"

TEILE=(
  src/10-kopf.html src/11-stil-teile.html src/12-stil-teile2.html
  src/13-stil-titel.html src/14-stil-nachtrag.html
  src/20-markup.html
)
SKRIPTE=(
  src/01-katalog-verlage.js src/02-katalog-hefte.js src/03-rotation.js
  src/04-quellen.js src/05-speicher.js src/06-abrufplan.js
  src/30-app.js src/31-app2.js src/32-app3.js src/33-titel.js src/39-start.js
)

{ cat "${TEILE[@]}"; echo '<script>'; cat "${SKRIPTE[@]}"; echo '</script>'; } > rotes-regal.html

{
  echo '<!doctype html>'
  echo '<html lang="de"><head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1">'
  echo '<style>:root{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  echo '</head><body>'
  cat rotes-regal.html
  echo '</body></html>'
} > rotes-regal-standalone.html

# Syntaxprüfung des Skriptteils
node -e '
const fs=require("fs"), h=fs.readFileSync("rotes-regal.html","utf8");
fs.writeFileSync("/tmp/.pruefung.js", h.match(/<script>([\s\S]*)<\/script>/)[1]);
' && node --check /tmp/.pruefung.js

printf "gebaut:\n  %-32s %8d Bytes\n  %-32s %8d Bytes\n" \
  rotes-regal.html "$(wc -c < rotes-regal.html)" \
  rotes-regal-standalone.html "$(wc -c < rotes-regal-standalone.html)"
