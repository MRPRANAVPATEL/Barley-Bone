# Fonts

Fonts load from Google Fonts via `index.html`: Instrument Serif (display), Geist (UI/body), Geist Mono (labels).
Fallback stacks are defined in `css/style.css`, so the page stays readable if the request fails.

To self-host, download the font files into this folder and replace the Google Fonts `<link>` with `@font-face` rules.
