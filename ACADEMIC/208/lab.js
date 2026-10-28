
const grid = document.querySelector("#lab-grid");

async function loadLabs() {
  try {
    console.log("Current page:", window.location.href);
    console.log("Loading JSON...");

    const response = await fetch("./labs.json");

    console.log("JSON response:", response.status);

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
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const title = document.createElement("h3");
      title.textContent = lab.name;

      const status = document.createElement("span");
      status.className = "card-status";
      status.textContent = "OPEN PROJECT ↗";

      card.append(number, title, status);
      grid.appendChild(card);
    });
  } catch (error) {
    grid.textContent = "Unable to load lab projects.";
    console.error(error);
  }
}

loadLabs();
