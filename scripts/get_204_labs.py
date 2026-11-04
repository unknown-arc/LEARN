from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
labs = []

for folder in sorted(ROOT.glob("LAB-*"), key=lambda p: int(p.name.split("-")[-1]) if p.name.split("-")[-1].isdigit() else 9999):
    if not folder.is_dir():
        continue
    circuits = sorted(p.name for p in folder.rglob("*.circ"))
    tasks = [p.name for p in folder.iterdir() if p.is_file() and p.name.lower() == "task.txt"]
    others = sorted(
        p.relative_to(folder).as_posix()
        for p in folder.rglob("*")
        if p.is_file() and p.suffix.lower() not in {".circ", ".txt"}
    )
    labs.append({
        "name": folder.name,
        "folder": folder.name,
        "task": tasks[0] if tasks else None,
        "circuits": circuits,
        "other_files": others,
    })

(ROOT / "labs.json").write_text(json.dumps(labs, indent=2), encoding="utf-8")
print(f"Generated labs.json with {len(labs)} labs.")
