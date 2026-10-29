const grid = document.querySelector("#lab-grid");
const section = document.querySelector("#playground-section");
const frame = document.querySelector("#playground-frame");
const title = document.querySelector("#active-lab-title");

function openLab(lab) {
  if (!/^LAB-[A-Za-z0-9_-]+$/.test(lab.folder || "")) return;
  title.textContent = lab.name || lab.folder;
  frame.src = `./playgrounds/index.html?lab=${encodeURIComponent(lab.folder)}`;
  section.hidden = false;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadLabs() {
  try {
    const response = await fetch("./labs.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`labs.json returned ${response.status}`);
    const labs = await response.json();
    grid.replaceChildren();
    if (!Array.isArray(labs) || labs.length === 0) {
      const p = document.createElement("p");
      p.className = "empty-message";
      p.textContent = "No labs found. Add lab folders and update labs.json.";
      grid.append(p);
      return;
    }
    labs.forEach((lab, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "content-card";
      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = String(i + 1).padStart(2, "0");
      const heading = document.createElement("h3");
      heading.textContent = lab.name || lab.folder;
      const status = document.createElement("span");
      status.className = "card-status";
      status.textContent = "OPEN PLAYGROUND ↗";
      card.append(number, heading, status);
      card.addEventListener("click", () => openLab(lab));
      grid.append(card);
    });
  } catch (error) {
    console.error(error);
    grid.textContent = "Unable to load labs.json. Check the file and use a local HTTP server.";
  }
}

document.querySelector("#close-playground").addEventListener("click", () => {
  frame.src = "about:blank";
  section.hidden = true;
});
loadLabs();
