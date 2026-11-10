/*
 * playground.js — loads one lab (?lab=LAB-n) and wires up the tabs.
 *
 * Data comes from ../LAB-n/index.json, written by scripts/get_204_labs.py:
 *   { task, circuits: [...], other_files: [...] }
 * Task.txt is drawn by render.js, .circ files by circuit.js. The "Other Files"
 * tab only exists when the lab has files besides Task.txt, *.circ and *.json.
 */
(function () {
  "use strict";

  const REPO = "https://github.com/unknown-arc/LEARN/tree/main/ACADEMIC/204/";
  const $ = (s) => document.querySelector(s);
  const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

  const params = new URLSearchParams(location.search);
  const lab = params.get("lab") || "";
  const validLab = /^LAB-[A-Za-z0-9_-]+$/.test(lab);
  const root = `../${encodeURIComponent(lab)}/`;

  /* ---------- tabs ---------- */

  const tabs = [
    { id: "task", label: "TASK" },
    { id: "circuit", label: "ARCHITECTURE / SOLUTION" },
    { id: "github", label: "GITHUB" },
    { id: "other", label: "OTHER FILES", hidden: true }
  ];

  function renderTabs() {
    const nav = $("#tabs");
    nav.replaceChildren();
    tabs.filter((t) => !t.hidden).forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.tab = t.id;
      b.textContent = t.label;
      if (t.count != null) {
        const c = document.createElement("span");
        c.className = "count";
        c.textContent = t.count;
        b.append(c);
      }
      nav.append(b);
    });
    const active = document.querySelector(".pane.active")?.id.replace("-pane", "") || "task";
    select(tabs.some((t) => t.id === active && !t.hidden) ? active : "task");
  }

  function select(name) {
    document.querySelectorAll(".tabs button").forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === name));
    document.querySelectorAll(".pane").forEach((p) =>
      p.classList.toggle("active", p.id === `${name}-pane`));
  }

  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-tab]");
    if (b) select(b.dataset.tab);
  });

  /* ---------- panes ---------- */

  async function loadTask(file) {
    const box = $("#task-content");
    if (!file) {
      box.innerHTML = '<p class="empty">No Task.txt was found in this lab folder.</p>';
      return;
    }
    try {
      const r = await fetch(root + encodePath(file));
      if (!r.ok) throw new Error("missing");
      TaskRender.mount(box, await r.text());
    } catch (e) {
      box.innerHTML = '<p class="empty">Task.txt could not be loaded.</p>';
    }
  }

  function loadCircuits(files) {
    const list = $("#circuit-list");
    const view = $("#circuit-view");
    list.replaceChildren();

    if (!files.length) {
      view.innerHTML = '<p class="empty">No .circ files in this lab yet. Add a Logisim file to the LAB folder and run <code>python scripts/get_204_labs.py</code>.</p>';
      return;
    }
    files.forEach((file, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "file-button";
      b.textContent = file;
      b.addEventListener("click", () => {
        list.querySelectorAll("button").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        CircuitView.show(view, root + encodePath(file), file);
      });
      list.append(b);
      if (i === 0) b.click();
    });
  }

  function loadOthers(files) {
    const list = $("#other-list");
    list.replaceChildren();
    files.forEach((file) => {
      const a = document.createElement("a");
      a.className = "file-button file-link";
      a.href = root + encodePath(file);
      a.download = file.split("/").pop();

      const ext = (file.includes(".") ? file.split(".").pop() : "file").toLowerCase();
      const badge = document.createElement("i");
      badge.className = "ext";
      badge.dataset.ext = ext;
      badge.textContent = ext.slice(0, 5).toUpperCase();

      a.append(badge, document.createTextNode(file + " ↓"));
      list.append(a);
    });
  }

  /* ---------- load ---------- */

  async function load() {
    $("#lab-name").textContent = validLab ? lab : "LAB NOT SPECIFIED";
    $("#github-url").href = validLab ? REPO + encodeURIComponent(lab) : REPO;

    if (!validLab) {
      $("#task-content").innerHTML = '<p class="empty">No lab selected.</p>';
      renderTabs();
      return;
    }

    let manifest = null;
    try {
      const r = await fetch(root + "index.json", { cache: "no-store" });
      if (!r.ok) throw new Error("missing");
      manifest = await r.json();
    } catch (e) {
      $("#task-content").innerHTML = '<p class="empty">Lab metadata is missing. Run <code>python scripts/get_204_labs.py</code> and commit the generated index.json files.</p>';
      $("#circuit-view").innerHTML = "";
      renderTabs();
      return;
    }

    const circuits = manifest.circuits || [];
    const others = manifest.other_files || [];

    tabs.find((t) => t.id === "circuit").count = circuits.length || null;
    const otherTab = tabs.find((t) => t.id === "other");
    otherTab.hidden = others.length === 0;
    otherTab.count = others.length;

    renderTabs();
    loadOthers(others);
    loadCircuits(circuits);
    await loadTask(manifest.task);
  }

  /* ---------- tell the embedding page how tall we are ---------- */

  function reportHeight() {
    if (window.parent === window) return;
    const h = Math.ceil(document.body.getBoundingClientRect().height);
    window.parent.postMessage({ type: "troal-playground-height", height: h }, location.origin);
  }
  if ("ResizeObserver" in window) new ResizeObserver(reportHeight).observe(document.body);
  window.addEventListener("load", reportHeight);

  load();
})();
