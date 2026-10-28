
const grid = document.querySelector("#subject-grid");
const count = document.querySelector("#subject-count");
const error = document.querySelector("#error-message");

async function loadSubjects() {
  try {
    const response = await fetch("./subjects.json");

    if (!response.ok) {
      throw new Error("Could not load subjects.json");
    }

    const subjects = await response.json();

    subjects.sort((a, b) =>
      a.code.localeCompare(b.code, undefined, { numeric: true })
    );

    grid.replaceChildren();

    if (subjects.length === 0) {
      grid.innerHTML =
        '<p class="status-message">No subject folders found yet.</p>';
      count.textContent = "0 SUBJECTS";
      return;
    }

    count.textContent =
      `${subjects.length} SUBJECT${subjects.length === 1 ? "" : "S"}`;

    for (const subject of subjects) {
      const card = document.createElement("a");
      card.className = "subject-card";
      card.href = `./${encodeURIComponent(subject.folder)}/`;

      const label = document.createElement("span");
      label.className = "subject-label";
      label.textContent = "SUBJECT / ACADEMIC";

      const arrow = document.createElement("span");
      arrow.className = "subject-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      const code = document.createElement("span");
      code.className = "subject-code";
      code.textContent = subject.code;

      const bottom = document.createElement("span");
      bottom.className = "subject-bottom";

      const text = document.createElement("span");
      text.textContent = "OPEN SUBJECT";

      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "→";

      bottom.append(text, icon);
      card.append(label, arrow, code, bottom);
      grid.append(card);
    }
  } catch (err) {
    console.error(err);
    grid.replaceChildren();
    count.textContent = "UNAVAILABLE";
    error.hidden = false;
  }
}

loadSubjects();
