
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBJECT_DIR = ROOT / "ACADEMIC" / "202"


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

        resources = {
            "migrations": [],
            "seeds": [],
            "queries": [],
            "tasks": [],
            "other": []
        }

        for category in ("migrations", "seeds", "queries"):
            folder = sql_dir / category

            if not folder.is_dir():
                continue

            resources[category] = [
                {
                    "name": f.name,
                    "path": f.relative_to(lab_dir).as_posix()
                }
                for f in sorted(
                    folder.rglob("*.sql"),
                    key=lambda f: f.as_posix().lower()
                )
                if f.is_file()
            ]

        if sql_dir.is_dir():
            for f in sorted(
                sql_dir.rglob("*"),
                key=lambda f: f.as_posix().lower()
            ):
                if not f.is_file():
                    continue

                if f.suffix.lower() in {".pdf", ".txt", ".md"}:
                    resources["tasks"].append({
                        "name": f.name,
                        "path": f.relative_to(lab_dir).as_posix(),
                        "type": f.suffix.lower().lstrip(".")
                    })

        manifest = {
            "name": lab["name"],
            "folder": lab["folder"],
            "resources": resources
        }

        manifest_path = lab_dir / "index.json"
        manifest_path.write_text(
            json.dumps(manifest, indent=2) + "\n",
            encoding="utf-8"
        )

        print(f"  Wrote {manifest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
