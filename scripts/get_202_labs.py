import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBJECT_DIR = ROOT / "ACADEMIC" / "202"

TASK_EXTENSIONS = {".pdf"}
ER_EXTENSIONS = {".drawio"}
TEXT_EXTENSIONS = {".txt", ".md", ".csv"}
IGNORED_DIRS = {"playgrounds", "__pycache__"}


def resource(file: Path, lab_dir: Path) -> dict:
    return {
        "name": file.name,
        "path": file.relative_to(lab_dir).as_posix(),
        "type": file.suffix.lower().lstrip(".")
    }


def sorted_files(folder: Path):
    return sorted(
        (f for f in folder.rglob("*") if f.is_file()),
        key=lambda f: f.as_posix().lower()
    )


def main():
    if not SUBJECT_DIR.is_dir():
        raise FileNotFoundError(f"Subject directory not found: {SUBJECT_DIR}")

    labs = []

    for folder in SUBJECT_DIR.iterdir():
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

    output = SUBJECT_DIR / "labs.json"
    output.write_text(
        json.dumps(labs, indent=2) + "\n",
        encoding="utf-8"
    )

    print(f"202: found {len(labs)} labs")
    print(f"Wrote {output.relative_to(ROOT)}")

    for lab in labs:
        lab_dir = SUBJECT_DIR / lab["folder"]
        sql_dir = lab_dir / "sql"
        lab_number = int(lab["folder"].removeprefix("LAB-"))

        resources = {
            "tasks": [],
            "er_diagrams": [],
            "migrations": [],
            "seeds": [],
            "queries": [],
            "sql_files": []
        }

        # Task PDFs and draw.io diagrams are discovered outside the SQL directory.
        for file in sorted_files(lab_dir):
            relative_parts = file.relative_to(lab_dir).parts

            if any(part in IGNORED_DIRS for part in relative_parts):
                continue

            if relative_parts[0].lower() == "sql":
                continue

            ext = file.suffix.lower()
            if ext == ".json":
                continue

            if ext in TASK_EXTENSIONS:
                resources["tasks"].append(resource(file, lab_dir))
            elif ext in ER_EXTENSIONS:
                resources["er_diagrams"].append(resource(file, lab_dir))
            elif lab_number >= 3:
                # Other loose files are grouped under SQL Files.
                resources["sql_files"].append(resource(file, lab_dir))

        # SQL subfolders have dedicated tabs from LAB-3 onwards.
        if lab_number >= 3 and sql_dir.is_dir():
            for category in ("migrations", "seeds", "queries"):
                folder = sql_dir / category
                if folder.is_dir():
                    resources[category] = [
                        resource(file, lab_dir)
                        for file in sorted_files(folder)
                        if file.suffix.lower() == ".sql"
                    ]

            # Files directly in sql/ or in unrecognised subfolders go to SQL Files.
            known_dirs = {"migrations", "seeds", "queries"}
            for file in sorted_files(sql_dir):
                relative = file.relative_to(sql_dir)
                if relative.parts[0].lower() in known_dirs:
                    continue
                if file.suffix.lower() == ".json":
                    continue
                resources["sql_files"].append(resource(file, lab_dir))

        # LAB-1 and LAB-2 expose only Task and ER Diagram categories.
        if lab_number in (1, 2):
            resources = {
                "tasks": resources["tasks"],
                "er_diagrams": resources["er_diagrams"]
            }
        else:
            resources.pop("er_diagrams")

        manifest = {
            "name": lab["name"],
            "folder": lab["folder"],
            "description": f"Resources and practical work for {lab['name']}.",
            "resources": resources
        }

        manifest_path = lab_dir / "index.json"
        manifest_path.write_text(
            json.dumps(manifest, indent=2) + "\n",
            encoding="utf-8"
        )

        print(f"  Wrote {manifest_path.relative_to(ROOT)}")

    print("Done. Commit the generated labs.json and LAB manifests.")


if __name__ == "__main__":
    main()
