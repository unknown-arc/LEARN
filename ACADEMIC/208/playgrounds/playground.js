// Change this to your real repo. The lab folder name is added at the end.
const REPO_URL = "https://github.com/YOUR-USERNAME/YOUR-REPO/tree/main/ACADEMIC/208";

const lab = new URLSearchParams(location.search).get("lab") || "";

const title = document.querySelector("#lab-title");
const viewToggle = document.querySelector("#view-toggle");
const githubLink = document.querySelector("#github-link");
const siteLink = document.querySelector("#site-link");
const closeButton = document.querySelector("#close");
const siteFrame = document.querySelector("#site-frame");
const taskView = document.querySelector("#task-view");
const pdfView = document.querySelector("#pdf-view");
const pdfFrame = document.querySelector("#pdf-frame");
const pdfLink = document.querySelector("#pdf-link");

let taskFile = "Task.txt";   // replaced by the value from labs.json
let pdfPath = null;          // e.g. "Resource/Lab 1.pdf" (labs 1-3 only)
let taskLoaded = false;
let viewingTask = false;

function setView(showTask) {
  viewingTask = showTask;
  siteFrame.hidden = showTask;
  // A lab with a PDF shows the PDF, every other lab shows its Task.txt.
  taskView.hidden = !showTask || Boolean(pdfPath);
  pdfView.hidden = !showTask || !pdfPath;
  viewToggle.textContent = showTask ? "VIEW WEBSITE" : "VIEW TASK";

  if (showTask) loadTask();
}

// "Resource/Lab 1.pdf" -> "../Resource/Lab%201.pdf"
function pathToUrl(path) {
  return "../" + path.split("/").map(encodeURIComponent).join("/");
}

async function loadTask() {
  if (taskLoaded) return;
  taskLoaded = true;

  if (pdfPath) {
    pdfFrame.src = pathToUrl(pdfPath);
    pdfLink.href = pathToUrl(pdfPath);
    return;
  }

  try {
    const response = await fetch(`../${lab}/${encodeURIComponent(taskFile)}`);
    if (!response.ok) throw new Error(`Could not load ${taskFile} (${response.status})`);

    taskView.replaceChildren(renderTask(await response.text()));
  } catch (error) {
    taskLoaded = false;
    taskView.textContent = error.message;
  }
}

// Ask the main page to close this panel.
function closePanel() {
  parent.postMessage({ type: "troal-208-close" }, location.origin);
}

async function loadLabInfo() {
  try {
    const response = await fetch("../labs.json");
    const labs = await response.json();
    const info = labs.find((item) => item.folder === lab);

    if (info) {
      title.textContent = info.name;
      if (info.task !== undefined) taskFile = info.task;
      pdfPath = info.pdf || null;
    }
  } catch (error) {
    console.error(error);
  }

  viewToggle.disabled = !taskFile && !pdfPath;
}

function start() {
  // Only accept folder names like LAB-1, so the URL can't point anywhere else.
  if (!/^LAB-\d+$/.test(lab)) {
    title.textContent = "Unknown lab";
    viewToggle.disabled = true;
    return;
  }

  title.textContent = lab.replace("-", " ");
  siteFrame.src = `../${lab}/`;
  siteLink.href = `../${lab}/`;
  githubLink.href = `${REPO_URL}/${lab}`;

  loadLabInfo();
}

viewToggle.addEventListener("click", () => setView(!viewingTask));
closeButton.addEventListener("click", closePanel);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
});

start();
