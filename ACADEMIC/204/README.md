# 204 – Computer Organization | TROAL

## Install
Copy this `204` folder into `ACADEMIC/204/` in the LEARN repository.

## Add your lab files
Keep each lab in its own folder:
```text
204/
  LAB-1/
    Task.txt
    your-circuit.circ
  LAB-2/
    Task.txt
    your-circuit.circ
```
The generator also detects nested `.circ` files and additional files.

## Generate lab metadata
Run from this folder:
```bash
python get_204_labs.py
```
This scans `LAB-*` folders and creates `labs.json`. Commit the generated file along with the site.

## GitHub Pages workflow
Add this command before the Pages artifact upload/build step:
```yaml
- name: Generate Computer Organization labs
  run: python ACADEMIC/204/get_204_labs.py
```
If your workflow already generates subject JSON files, add this command beside those generators.

## Viewer note
The playground displays formatted Task.txt, detects circuit components/wires from Logisim XML, lists component attributes, exposes the circuit XML, and provides the original `.circ` download. Full circuit drawing and interactive simulation should be done in Logisim Evolution; this starter viewer does not claim to reproduce Logisim's simulator.
