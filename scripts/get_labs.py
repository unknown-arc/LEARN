
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ACADEMIC_DIR = ROOT / "ACADEMIC"

SQL_DIRS = {
    "migrations": "MIGRATIONS",
    "seeds": "SEEDS",
    "queries": "QUERIES",
}

TASK_EXTENSIONS = {".pdf", ".txt", ".md"}

def generate_lab(lab_dir):
    sql_dir = lab_dir / "sql"

    manifest = {
        "name": lab_dir.name.replace("-", " ").title(),
        "folder": lab_dir.name,
        "resources": {
            "migrations": [],
            "seeds": [],
            "queries": [],
            "tasks": [],
            "other": []
        }
    }

    for folder_name, category in SQL_DIRS.items():
        folder = sql_dir / folder_name

        manifest["resources"][folder_name] = [
            {
                "name": f.name,
                "path": f.relative_to(lab_dir).as_posix()
            }
            for f in sorted(
                folder.rglob("*") if folder.is_dir() else [],
                key=lambda f: f.as_posix().lower()
            )
            if f.is_file() and f.suffix.lower() == ".sql"
        ]

    if sql_dir.is_dir():
        for f in sorted(sql_dir.rglob("*"), key=lambda f: f.as_posix().lower()):
            if not f.is_file():
                continue

            if f.suffix.lower() in TASK_EXTENSIONS:
                manifest["resources"]["tasks"].append({
                    "name": f.name,
                    "path": f.relative_to(lab_dir).as_posix(),
                    "type": f.suffix.lower().lstrip(".")
                })

    output = lab_dir / "index.json"
    output.write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8"
    )

    print(f"  Wrote {output.relative_to(ROOT)}")


def main():
    if not ACADEMIC_DIR.is_dir():
        raise FileNotFoundError(f"Academic directory not found: {ACADEMIC_DIR}")

    for subject_dir in sorted(ACADEMIC_DIR.iterdir()):
        if not subject_dir.is_dir() or not subject_dir.name.isdigit():
            continue

        labs = []

        for folder in subject_dir.iterdir():
            if not folder.is_dir() or not folder.name.startswith("LAB-"):
                continue

            suffix = folder.name.removeprefix("LAB-")
            if not suffix.isdigit():
                continue

            labs.append({
                "name": folder.name.replace("-", " ").title(),
                "folder": folder.name
            })

        labs.sort(key=lambda lab: int(lab["folder"].removeprefix("LAB-")))

        output = subject_dir / "labs.json"
        output.write_text(
            json.dumps(labs, indent=2) + "\n",
            encoding="utf-8"
        )

        print(f"{subject_dir.name}: found {len(labs)} labs")

        for lab in labs:
            generate_lab(subject_dir / lab["folder"])


if __name__ == "__main__":
    main()
