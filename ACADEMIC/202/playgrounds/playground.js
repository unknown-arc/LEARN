const params = new URLSearchParams(location.search);
const labFolder = params.get("lab");
const $ = (selector) => document.querySelector(selector);
const el = { title: $("#lab-title"), description: $("#lab-description"), error: $("#load-error"), count: $("#resource-count"), tabs: $("#resource-tabs"), list: $("#resource-list"), file: $("#active-file-name"), status: $("#editor-status"), editor: $("#sql-editor"), editorWrap: $("#sql-editor-wrap"), task: $("#task-view"), taskDescription: $("#task-description"), taskLink: $("#task-open-link"), pdf: $("#task-preview"), text: $("#text-preview"), results: $("#query-results"), console: $("#console-output") };
const categories = ["migrations", "seeds", "queries", "tasks", "other"];
const state = { manifest: null, folder: labFolder, SQL: null, db: null, category: "migrations" };

function log(message, type = "info") { const p = document.createElement("p"); p.className = `line ${type}`; p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`; el.console.append(p); el.console.scrollTop = el.console.scrollHeight; }
function status(message, error = false) { el.status.textContent = message; el.status.classList.toggle("error", error); }
function files(category) { return Array.isArray(state.manifest?.resources?.[category]) ? state.manifest.resources[category] : []; }
function resourceUrl(path) { if (typeof path !== "string" || path.startsWith("/") || path.split("/").includes("..")) throw new Error(`Invalid resource path: ${path}`); return `../${state.folder}/${path}`; }
function clearTask() { el.task.hidden = true; el.taskLink.hidden = true; el.pdf.hidden = true; el.text.hidden = true; el.pdf.removeAttribute("src"); el.text.textContent = ""; }
function showEditor() { clearTask(); el.editorWrap.hidden = false; }
function showTask() { el.editorWrap.hidden = true; el.task.hidden = false; }

async function openResource(file, button) {
  el.list.querySelectorAll(".resource-item").forEach((node) => node.classList.toggle("active", node === button));
  el.file.textContent = file.name || file.path || "Resource";
  const path = file.path || "";
  const ext = path.split(".").pop().toLowerCase();
  try {
    const url = resourceUrl(path);
    if (ext === "sql") {
      showEditor(); const response = await fetch(url); if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
      el.editor.value = await response.text(); status("FILE LOADED"); log(`Loaded ${path}`, "success"); return;
    }
    showTask(); el.taskDescription.textContent = file.description || path || "Resource"; el.taskLink.href = url; el.taskLink.hidden = false;
    if (ext === "pdf") { el.pdf.src = url; el.pdf.hidden = false; el.text.hidden = true; status("PDF RESOURCE"); return; }
    if (["txt", "md", "json", "csv"].includes(ext)) { const response = await fetch(url); if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`); el.text.textContent = await response.text(); el.text.hidden = false; el.pdf.hidden = true; status("TEXT RESOURCE"); return; }
    el.pdf.hidden = true; el.text.hidden = true; status("RESOURCE LINK");
  } catch (error) { status("LOAD ERROR", true); el.taskDescription.textContent = error.message; showTask(); log(error.message, "error"); }
}

function renderCategory(category) {
  state.category = category;
  el.tabs.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.category === category));
  const items = files(category); el.count.textContent = items.length; el.list.replaceChildren();
  if (!items.length) { const p = document.createElement("p"); p.className = "empty"; p.textContent = `No ${category} resources are listed for this lab.`; el.list.append(p); el.file.textContent = "No file selected"; if (category === "tasks" || category === "other") { showTask(); el.taskDescription.textContent = "No resource is available in this category."; } else { showEditor(); el.editor.value = ""; } return; }
  items.forEach((file) => { const b = document.createElement("button"); b.type = "button"; b.className = "resource-item"; const icon = document.createElement("span"); icon.className = "file-icon"; const ext = (file.name || file.path || "FILE").split(".").pop().toUpperCase(); icon.textContent = ext.length > 4 ? "FILE" : ext; const details = document.createElement("span"); const name = document.createElement("span"); name.className = "file-name"; name.textContent = file.name || file.path || "Unnamed resource"; const path = document.createElement("span"); path.className = "file-path"; path.textContent = file.path || ""; details.append(name, path); b.append(icon, details); b.addEventListener("click", () => openResource(file, b)); el.list.append(b); });
  el.list.querySelector("button")?.click();
}

function renderResults(resultSets) {
  el.results.replaceChildren();
  if (!resultSets.length) { const p = document.createElement("p"); p.className = "message"; p.textContent = "Statement executed successfully. No result table was returned."; el.results.append(p); return; }
  resultSets.forEach((result) => { const wrap = document.createElement("div"); wrap.className = "table-wrap"; const table = document.createElement("table"); table.className = "result-table"; const thead = document.createElement("thead"); const hr = document.createElement("tr"); result.columns.forEach((col) => { const th = document.createElement("th"); th.textContent = col; hr.append(th); }); thead.append(hr); table.append(thead); const tbody = document.createElement("tbody"); result.values.forEach((row) => { const tr = document.createElement("tr"); row.forEach((value) => { const td = document.createElement("td"); td.textContent = value === null ? "NULL" : String(value); tr.append(td); }); tbody.append(tr); }); if (!result.values.length) { const tr = document.createElement("tr"); const td = document.createElement("td"); td.colSpan = Math.max(result.columns.length, 1); td.textContent = "No rows returned."; tr.append(td); tbody.append(tr); } table.append(tbody); wrap.append(table); el.results.append(wrap); });
}

function execute(sql, label = "SQL") {
  if (!state.db) { status("DATABASE NOT READY", true); log("SQLite engine is not ready.", "error"); return false; }
  if (!sql.trim()) { status("EMPTY SQL", true); log("Nothing to execute.", "error"); return false; }
  try { renderResults(state.db.exec(sql)); status("EXECUTED"); log(`${label} executed successfully.`, "success"); return true; }
  catch (error) { status("SQL ERROR", true); el.results.replaceChildren(); const p = document.createElement("p"); p.className = "message error"; p.textContent = error.message; el.results.append(p); log(error.message, "error"); return false; }
}

async function runFiles(category) {
  const items = files(category).filter((file) => (file.path || "").toLowerCase().endsWith(".sql"));
  if (!items.length) { log(`No SQL files to run in ${category}.`); return true; }
  for (const file of items) { try { const response = await fetch(resourceUrl(file.path)); if (!response.ok) throw new Error(`Could not load ${file.path} (${response.status})`); const sql = await response.text(); el.editor.value = sql; el.file.textContent = file.name || file.path; if (!execute(sql, file.name || file.path)) { log(`Stopped while running ${category}.`, "error"); return false; } } catch (error) { status("RESOURCE ERROR", true); log(error.message, "error"); return false; } }
  return true;
}

async function rebuild() {
  if (!state.SQL) { log("SQLite engine is not ready.", "error"); return; }
  try { state.db?.close(); state.db = new state.SQL.Database(); el.results.replaceChildren(); log("Database reset."); if (!await runFiles("migrations")) return; if (!await runFiles("seeds")) return; status("DATABASE READY"); log("Database rebuilt from migrations and seeds.", "success"); }
  catch (error) { status("REBUILD ERROR", true); log(error.message, "error"); }
}

async function initEngine() {
  if (typeof initSqlJs !== "function") { status("ENGINE UNAVAILABLE", true); log("SQL.js failed to load. Check internet access/CDN availability.", "error"); return; }
  try { state.SQL = await initSqlJs({ locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}` }); state.db = new state.SQL.Database(); log("SQLite engine ready. Data is temporary in this browser session.", "success"); }
  catch (error) { status("ENGINE ERROR", true); log(error.message, "error"); }
}

async function loadLab() {
  if (!labFolder || !/^LAB-[A-Za-z0-9_-]+$/.test(labFolder)) { el.title.textContent = "No lab selected"; el.description.textContent = "Return to the subject page and choose a lab."; el.error.hidden = false; el.error.textContent = "Missing or invalid lab identifier. Expected a folder like LAB-3."; return; }
  try { const response = await fetch(`../${labFolder}/index.json`, { cache: "no-store" }); if (!response.ok) throw new Error(`Could not load ../${labFolder}/index.json (${response.status})`); state.manifest = await response.json(); state.manifest.resources ||= {}; categories.forEach((category) => { if (!Array.isArray(state.manifest.resources[category])) state.manifest.resources[category] = []; }); el.title.textContent = state.manifest.name || labFolder; el.description.textContent = state.manifest.description || "Browse resources, edit SQL, and run it in the local SQLite playground."; const total = categories.reduce((sum, category) => sum + files(category).length, 0); log(`Loaded ${labFolder} manifest with ${total} resources.`, "success"); renderCategory("migrations"); }
  catch (error) { el.error.hidden = false; el.error.textContent = `${error.message}. Ensure this lab contains a valid index.json.`; el.description.textContent = "Unable to load lab resources."; log(error.message, "error"); }
}

el.tabs.addEventListener("click", (event) => { const button = event.target.closest("button[data-category]"); if (button) renderCategory(button.dataset.category); });
$("#run-sql").addEventListener("click", () => execute(el.editor.value, "Editor SQL"));
$("#run-migrations").addEventListener("click", () => runFiles("migrations"));
$("#run-seeds").addEventListener("click", () => runFiles("seeds"));
$("#rebuild-db").addEventListener("click", rebuild);
$("#clear-results").addEventListener("click", () => { el.results.replaceChildren(); const p = document.createElement("p"); p.className = "muted"; p.textContent = "Results cleared."; el.results.append(p); });
$("#clear-console").addEventListener("click", () => { el.console.replaceChildren(); log("Console cleared."); });
initEngine(); loadLab();
