import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUBJECT_DIR = ROOT / "ACADEMIC" / "208"

# Only these labs have a task PDF, kept in ACADEMIC/208/Resource/
PDF_LABS = {1, 2, 3}


def find_task_file(lab_dir):
    """Return the real name of the lab's Task.txt (any letter case), or None."""
    for file in lab_dir.iterdir():
        if file.is_file() and file.name.lower() == "task.txt":
            return file.name
    return None


def find_lab_pdfs():
    """Match the PDFs in Resource/ to lab numbers, e.g. "Lab 1.pdf" -> 1.

    The lab number is read from the file name ("Lab1", "LAB-2", "lab_03"),
    or from a leading number ("3_task.pdf"). Returns {lab_number: "Resource/file.pdf"}.
    """

    for resource_dir in SUBJECT_DIR.iterdir():
        if not (resource_dir.is_dir() and resource_dir.name == "Resource"):
            continue

        for file in sorted(resource_dir.iterdir()):    
            if file.suffix.lower() == ".pdf":
                pdf_name = resource_dir.name + "/" + file.name.lower()
                return pdf_name

def main():
    if not SUBJECT_DIR.is_dir():
        raise FileNotFoundError(f"Subject directory not found: {SUBJECT_DIR}")

    labs = []
    pdfs = find_lab_pdfs()

    for folder in SUBJECT_DIR.iterdir():
        if (
            folder.is_dir()
            and folder.name.startswith("LAB-")
            and folder.name.removeprefix("LAB-").isdigit()
            and (folder / "index.html").is_file()
        ):
            labs.append({                    
                "name": folder.name.replace("-", " ").title(),
                "folder": folder.name,
                "task": find_task_file(folder),
                "pdf": pdfs if folder.name in ["LAB-1", "LAB-2", "LAB-3"] else None
            })

    labs.sort(key=lambda lab: int(lab["folder"].removeprefix("LAB-")))

    output = SUBJECT_DIR / "labs.json"
    output.write_text(
        json.dumps(labs, indent=2) + "\n",
        encoding="utf-8"
    )

    print(f"208: found {len(labs)} labs")
    print(f"Wrote {output.relative_to(ROOT)}")

    for lab in labs:
        print(
            f"  {lab['folder']}: "
            f"Task.txt = {lab['task'] or 'none'}, PDF = {lab['pdf'] or 'none'}"
        )


if __name__ == "__main__":
    main()
