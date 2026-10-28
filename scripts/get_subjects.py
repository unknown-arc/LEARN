
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ACADEMIC_DIR = ROOT / "Academic"
OUTPUT_FILE = ACADEMIC_DIR / "subjects.json"


def main():
    subjects = []

    for folder in ACADEMIC_DIR.iterdir():
        if not folder.is_dir():
            continue

        if folder.name.startswith("."):
            continue

        if not (folder / "index.html").is_file():
            continue

        subjects.append({
            "code": folder.name,
            "folder": folder.name,
        })

    subjects.sort(
        key=lambda subject: (
            not subject["code"].isdigit(),
            int(subject["code"])
            if subject["code"].isdigit()
            else subject["code"].lower(),
        )
    )

    OUTPUT_FILE.write_text(
        json.dumps(subjects, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Generated {len(subjects)} subject entries.")


if __name__ == "__main__":
    main()
