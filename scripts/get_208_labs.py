
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBJECT_DIR = ROOT / "ACADEMIC" / "208"


def main():
    if not SUBJECT_DIR.is_dir():
        raise FileNotFoundError(f"Subject directory not found: {SUBJECT_DIR}")

    labs = []

    for folder in SUBJECT_DIR.iterdir():
        if (
            folder.is_dir()
            and folder.name.startswith("LAB-")
            and folder.name.removeprefix("LAB-").isdigit()
            and (folder / "index.html").is_file()
        ):
            labs.append({
                "name": folder.name.replace("-", " ").title(),
                "folder": folder.name
            })

    labs.sort(key=lambda lab: int(lab["folder"].removeprefix("LAB-")))

    output = SUBJECT_DIR / "labs.json"
    output.write_text(
        json.dumps(labs, indent=2) + "\n",
        encoding="utf-8"
    )

    print(f"208: found {len(labs)} labs")
    print(f"Wrote {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
