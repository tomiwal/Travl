Put the Vergilia font files here (from Attract Studio, purchased or downloaded from where you got it):

  Vergilia.woff2   (preferred)
  Vergilia.otf
  Vergilia.ttf

Any one of them works. The logo picks it up automatically (see client/src/styles.css, @font-face).

Check the font's license before committing it to a public GitHub repo. Many fonts allow
use on a website but not redistribution of the file. If yours doesn't, add
client/public/fonts/Vergilia.* to .gitignore and the logo falls back to a serif font.
