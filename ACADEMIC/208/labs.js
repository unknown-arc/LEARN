
const grid = document.querySelector("#lab-grid");
const panel = document.querySelector("#lab-panel");
const panelFrame = document.querySelector("#lab-frame");

let closeTimer;

function openPanel(folder) {
  clearTimeout(closeTimer);
  panelFrame.src = `./playgrounds/index.html?lab=${encodeURIComponent(folder)}`;
  panel.hidden = false;
  document.body.classList.add("panel-open");

  // Wait one frame so the slide-up animation plays.
  requestAnimationFrame(() => panel.classList.add("open"));
}

function closePanel() {
  panel.classList.remove("open");
  document.body.classList.remove("panel-open");

  // Hide the panel and stop the lab website once the slide-down has finished.
  closeTimer = setTimeout(() => {
    panel.hidden = true;
    panelFrame.src = "about:blank";
  }, 250);
}

// The close button lives inside the panel, so it sends us a message.
window.addEventListener("message", (event) => {
  if (event.origin !== location.origin) return;
  if (event.source !== panelFrame.contentWindow) return;
  if (event.data && event.data.type === "troal-208-close") closePanel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panel.hidden) closePanel();
});

async function loadLabs() {
  try {
    const response = await fetch("./labs.json");

    if (!response.ok) {
      throw new Error("Could not load labs");
    }

    const labs = await response.json();

    if (labs.length === 0) {
      grid.textContent = "No lab projects found yet.";
      return;
    }

    labs.forEach((lab, index) => {
      const card = document.createElement("a");

      card.className = "content-card";
      card.href = `./${lab.folder}/`;

      // A normal click opens the panel. Ctrl/Cmd/Shift-click still opens a new tab.
      card.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        openPanel(lab.folder);
      });

      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const title = document.createElement("h3");
      title.textContent = lab.name;

      const status = document.createElement("span");
      status.className = "card-status";
      status.textContent = "OPEN PROJECT ↑";

      card.append(number, title, status);
      grid.appendChild(card);
    });
  } catch (error) {
    grid.textContent = "Unable to load lab projects.";
    console.error(error);
  }
}

loadLabs();
