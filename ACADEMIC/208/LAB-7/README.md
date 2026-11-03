# Cozy Room Productivity Suite

An isometric 3D room (SVG, projected from 3D coordinates in `script.js`) that links to two tools.

```
index.html / style.css / script.js     the room
to-do/                                 to-do list (index.html, style.css, script.js)
grade-calculator/                      grade calculator (index.html, style.css, script.js)
.github/workflows/pages.yml            GitHub Pages deploy
```

- Whiteboard opens `to-do/`, the table paper opens `grade-calculator/`.
- The bin throws out finished tasks (tasks are shared through `localStorage`).
- All links are relative, so it works at `https://<user>.github.io/<repo>/`.

## Deploy
1. Push this folder to a repo on the `main` branch.
2. In the repo, go to Settings > Pages and set Source to **GitHub Actions**.
3. Every push to `main` deploys the site.
