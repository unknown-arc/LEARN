# 204 – Computer Organization | TROAL

## Lab folders
Keep each lab in its own `LAB-n` folder:
```text
ACADEMIC/204/
  LAB-1/
    Task.txt          -> shown on the TASK tab (render.js)
    adder.circ        -> shown on ARCHITECTURE / SOLUTION (circuit.js)
    anything-else.*   -> shown on OTHER FILES (tab only appears if present)
```
Nested `.circ` files are found too. Generated `*.json` files are ignored.

## Generate metadata
Run from the repository root:
```bash
python scripts/get_204_labs.py
```
It writes `ACADEMIC/204/labs.json` (the lab folders only) and an `index.json`
inside every lab (task, circuits, other files). Commit the generated files.

## GitHub Pages workflow
Add before the Pages build/upload step:
```yaml
- name: Generate Computer Organization labs
  run: python scripts/get_204_labs.py
```

## Playground files (`ACADEMIC/204/playgrounds/`)
- `index.html`, `style.css` – the shared playground layout
- `playground.js` – reads `LAB-n/index.json`, builds the tabs
- `render.js` – turns `Task.txt` into the designed task sheet
- `circuit.js` – draws a layout preview of Logisim `.circ` files

The circuit view is a layout preview, not a simulator; use Logisim Evolution
for exact symbols and simulation.
