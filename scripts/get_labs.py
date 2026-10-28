
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ACADEMIC_DIR = ROOT / "ACADEMIC"


def main():
    for subject_dir in ACADEMIC_DIR.iterdir():
        if not subject_dir.is_dir() or not subject_dir.name.isdigit():
            continue

        labs = []

        for folder in subject_dir.iterdir():
            if (
                folder.is_dir()
                and folder.name.startswith("LAB-")
                and (folder / "index.html").is_file()
            ):
                labs.append({
                    "name": folder.name.replace("-", " ").title(),
                    "folder": folder.name
                })

        labs.sort(key=lambda lab: int(lab["folder"].split("-")[-1]))

        output = subject_dir / "labs.json"
        output.write_text(
            json.dumps(labs, indent=2) + "\n",
            encoding="utf-8"
        )

        print(f"{subject_dir.name}: found {len(labs)} labs")


if __name__ == "__main__":
    main()
