
const REPO_URL = "https://github.com/unknown-arc/LEARN/tree/main/ACADEMIC/208";

const lab = new URLSearchParams(location.search).get("lab") || "";

// Elements
const title = document.querySelector("#lab-title");
const pdfToggle = document.querySelector("#pdf-toggle");
const viewToggle = document.querySelector("#view-toggle");
const githubLink = document.querySelector("#github-link");
const siteLink = document.querySelector("#site-link");
const closeButton = document.querySelector("#close");

const siteFrame = document.querySelector("#site-frame");
const taskView = document.querySelector("#task-view");
const pdfView = document.querySelector("#pdf-view");
const pdfFrame = document.querySelector("#pdf-frame");
const pdfLink = document.querySelector("#pdf-link");

// Initial state
let taskFile = "Task.txt";
let pdfPath = null;
let taskLoaded = false;
let currentView = "website";

// Hide resource button immediately.
// It will be displayed only if labs.json contains a PDF.
pdfToggle.hidden = true;

// Convert a relative path into a URL.
// Example: Resource/Lab 1.pdf -> ../Resource/Lab%201.pdf
function pathToUrl(path) {
  return "../" + path.split("/").map(encodeURIComponent).join("/");
}

// Switch between website, task, and resource views.
function setView(view) {
  if (!["website", "task", "resource"].includes(view)) return;

  if (view === "resource" && !pdfPath) return;

  currentView = view;

  siteFrame.hidden = view !== "website";
  taskView.hidden = view !== "task";
  pdfView.hidden = view !== "resource";

  viewToggle.textContent =
    view === "task" ? "VIEW WEBSITE" : "VIEW TASK";

  if (view === "task") {
    loadTask();
  }

  if (view === "resource") {
    loadResource();
  }
}

// Load and render Task.txt only once.
async function loadTask() {
  if (taskLoaded) return;

  taskLoaded = true;

  try {
    const response = await fetch(
      `../${lab}/${encodeURIComponent(taskFile)}`
    );

    if (!response.ok) {
      throw new Error(
        `Could not load ${taskFile} (${response.status})`
      );
    }

    const content = await response.text();

    // Render only if the user is still viewing the task.
    if (currentView === "task") {
      taskView.replaceChildren(renderTask(content));
    }
  } catch (error) {
    taskLoaded = false;

    if (currentView === "task") {
      taskView.textContent = error.message;
    }

    console.error(error);
  }
}

// Load the PDF resource.
function loadResource() {
  if (!pdfPath) return;

  const url = pathToUrl(pdfPath);

  // Prevent unnecessary PDF reloads.
  if (pdfFrame.dataset.loaded !== url) {
    pdfFrame.src = url;
    pdfFrame.dataset.loaded = url;
  }

  pdfLink.href = url;
}

// Load lab information from labs.json.
async function loadLabInfo() {
  try {
    const response = await fetch("../labs.json");

    if (!response.ok) {
      throw new Error("Could not load labs.json");
    }

    const labs = await response.json();

    if (!Array.isArray(labs)) {
      throw new Error("Invalid labs.json format");
    }

    const info = labs.find(item => item.folder === lab);

    if (!info) {
      throw new Error("Lab information not found");
    }

    title.textContent = info.name || lab.replace("-", " ");

    taskFile = info.task || "Task.txt";
    pdfPath = typeof info.pdf === "string" && info.pdf.trim()
      ? info.pdf.trim()
      : null;

    // Show resource button only when a PDF path exists.
    pdfToggle.hidden = !pdfPath;

    // Always start with the lab website.
    setView("website");

  } catch (error) {
    console.error(error);

    title.textContent = "Unable to load lab information";
    viewToggle.disabled = true;
    pdfToggle.hidden = true;
  }
}

// Ask the parent page to close this panel.
function closePanel() {
  parent.postMessage(
    { type: "troal-208-close" },
    location.origin
  );
}

// Initialize the viewer.
function start() {
  // Accept only folder names like LAB-1, LAB-2, etc.
  if (!/^LAB-\d+$/.test(lab)) {
    title.textContent = "Unknown lab";
    viewToggle.disabled = true;
    pdfToggle.hidden = true;
    return;
  }

  title.textContent = lab.replace("-", " ");

  siteFrame.src = `../${lab}/`;
  siteLink.href = `../${lab}/`;
  githubLink.href = `${REPO_URL}/${lab}`;

  loadLabInfo();
}

// Website / Task toggle.
viewToggle.addEventListener("click", () => {
  setView(currentView === "task" ? "website" : "task");
});

// Resource button.
pdfToggle.addEventListener("click", () => {
  setView("resource");
});

// Close button.
closeButton.addEventListener("click", closePanel);

// Escape key.
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePanel();
  }
});

// Start.
start();
