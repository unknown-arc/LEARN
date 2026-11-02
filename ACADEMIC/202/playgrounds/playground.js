const params = new URLSearchParams(location.search);
const labFolder = params.get("lab");
const $ = (selector) => document.querySelector(selector);

const el = {
    title: $("#lab-title"),
    description: $("#lab-description"),
    error: $("#load-error"),
    count: $("#resource-count"),
    tabs: $("#resource-tabs"),
    list: $("#resource-list"),
    file: $("#active-file-name"),
    status: $("#editor-status"),
    editor: $("#sql-editor"),
    editorWrap: $("#sql-editor-wrap"),
    editorViewToggle: $("#editor-view-toggle"),
    editorDownload: $("#editor-download"),
    editorCopy: $("#editor-copy"),
    editorDatabaseView: $("#editor-database-view"),
    editorTableSelect: $("#editor-table-select"),
    editorLiveTable: $("#editor-live-table"),
    task: $("#task-view"),
    taskDescription: $("#task-description"),
    taskLink: $("#task-open-link"),
    pdf: $("#task-preview"),
    text: $("#text-preview"),
    results: $("#query-results"),
    console: $("#console-output"),
};

const state = {
    manifest: null,
    folder: labFolder,
    SQL: null,
    db: null,
    category: "",
    editor: null,
    viewingTables: false,
    activeFile: null,
    isErLab: false
};

function log(message, type = "info") {
    const p = document.createElement("p");
    p.className = `line ${type}`;
    p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    el.console.append(p);
    el.console.scrollTop = el.console.scrollHeight;
}

function status(message, error = false) {
    el.status.textContent = message;
    el.status.classList.toggle("error", error);
}

function resources(category) {
    return Array.isArray(state.manifest?.resources?.[category])
        ? state.manifest.resources[category]
        : [];
}

function resourceUrl(path) {
    if (
        typeof path !== "string" ||
        path.startsWith("/") ||
        path.split("/").includes("..")
    ) {
        throw new Error(`Invalid resource path: ${path}`);
    }

    return `../${state.folder}/${path}`;
}

function clearTask() {
    el.task.hidden = true;
    el.taskLink.hidden = true;
    el.pdf.hidden = true;
    el.text.hidden = true;
    el.pdf.removeAttribute("src");
    el.text.textContent = "";
}

function showEditor() {
    clearTask();
    state.viewingTables = false;
    el.console.hidden = false;
    el.editorViewToggle.textContent = "VIEW TABLES";
    el.editorWrap.hidden = false;
    const cm = el.editorWrap.querySelector(".CodeMirror");
    if (cm) cm.hidden = false;
    el.editorWrap.querySelectorAll(".sql-action").forEach((button) => {
        button.hidden = false;
    });
    el.editorDatabaseView.hidden = true;
}

function showTask() {
    state.viewingTables = false;
    el.console.hidden = false;
    el.editorViewToggle.textContent = "VIEW TABLES";
    el.editorWrap.hidden = true;
    el.editorDatabaseView.hidden = true;
    el.task.hidden = false;
}

function resetEditorTools(file = null) {
    state.activeFile = file;
    const path = file?.path || "";
    const ext = path.split(".").pop().toLowerCase();
    const isSql = ext === "sql";
    const downloadable = ["pdf", "drawio", "xml", "txt", "md", "csv"].includes(ext);
    el.editorViewToggle.hidden = state.isErLab || !isSql;
    el.editorDownload.hidden = !downloadable;
    el.editorCopy.hidden = !isSql;
    el.editorDownload.onclick = downloadable ? () => downloadResource(file) : null;
    el.editorCopy.onclick = isSql ? copyEditorCode : null;
}

function downloadResource(file) {
    const url = resourceUrl(file.path);
    const link = document.createElement("a");
    link.href = url;
    link.download = (file.name || file.path.split("/").pop());
    document.body.append(link);
    link.click();
    link.remove();
}

async function copyEditorCode() {
    const code = getEditorValue();
    try {
        await navigator.clipboard.writeText(code);
        log("SQL code copied to clipboard.", "success");
        el.editorCopy.textContent = "COPIED";
        setTimeout(() => { el.editorCopy.textContent = "COPY CODE"; }, 1200);
    } catch {
        const temp = document.createElement("textarea");
        temp.value = code;
        document.body.append(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        log("SQL code copied to clipboard.", "success");
    }
}

function startNewQuery() {
    showEditor();
    resetEditorTools(null);
    el.file.textContent = "NEW QUERY";
    setEditorValue("-- Write your SQL query here\n");
    status("NEW QUERY");
    state.editor?.focus();
}

function setEditorValue(value) {
    if (state.editor) {
        state.editor.setValue(value);
    } else {
        el.editor.value = value;
    }
}

function getEditorValue() {
    return state.editor ? state.editor.getValue() : el.editor.value;
}

async function openResource(file, button) {
    el.list.querySelectorAll(".resource-item").forEach((node) => {
        node.classList.toggle("active", node === button);
    });

    el.file.textContent = file.name || file.path || "Resource";
    resetEditorTools(file);
    const path = file.path || "";
    const ext = path.split(".").pop().toLowerCase();

    try {
        const url = resourceUrl(path);

        if (ext === "sql") {
            showEditor();
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Could not load ${path} (${response.status})`);
            }

            setEditorValue(await response.text());
            status("FILE LOADED");
            log(`Loaded SQL file: ${path}`, "success");
            return;
        }

        showTask();
        el.taskDescription.textContent = file.description || path || "Resource";
        el.taskLink.href = url;
        el.taskLink.hidden = false;

        if (ext === "pdf") {
            // The editor-panel download button is the single download control.
            el.taskLink.hidden = true;
            el.pdf.src = url;
            el.pdf.hidden = false;
            el.text.hidden = true;
            status("TASK PDF");
            log(`Opened task PDF: ${path}`, "info");
            return;
        }

        if (ext === "drawio" || ext === "xml") {
            const absoluteUrl = new URL(url, location.href).href;
            el.pdf.src = `https://viewer.diagrams.net/?url=${encodeURIComponent(absoluteUrl)}`;
            el.pdf.hidden = false;
            el.text.hidden = true;
            el.taskDescription.textContent = `ER diagram: ${file.name || path}. If the preview does not load, use Open Resource to open it in diagrams.net.`;
            el.taskLink.hidden = false;
            el.taskLink.textContent = "OPEN IN DRAW.IO ↗";
            status("ER DIAGRAM");
            log(`Opened ER diagram: ${path}`, "success");
            return;
        }

        el.taskLink.textContent = ["txt", "md", "csv"].includes(ext) ? "DOWNLOAD FILE ↓" : "OPEN RESOURCE ↗";
        el.taskLink.download = ["txt", "md", "csv"].includes(ext) ? (file.name || path.split("/").pop()) : "";

        if (["txt", "md", "csv"].includes(ext)) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Could not load ${path} (${response.status})`);
            }

            el.text.textContent = await response.text();
            el.text.hidden = false;
            el.pdf.hidden = true;
            status("TEXT RESOURCE");
            return;
        }

        el.pdf.hidden = true;
        el.text.hidden = true;
        status("RESOURCE LINK");
    } catch (error) {
        status("LOAD ERROR", true);
        el.taskDescription.textContent = error.message;
        showTask();
        log(error.message, "error");
    }
}

function categoryList() {
    const isErLab = ["LAB-1", "LAB-2"].includes(state.folder);

    if (isErLab) {
        return [
            { id: "tasks", label: "Task" },
            { id: "er_diagrams", label: "ER Diagram" }
        ];
    }

    return [
        { id: "tasks", label: "Task" },
        { id: "migrations", label: "Migrations" },
        { id: "seeds", label: "Seeds" },
        { id: "queries", label: "Queries" },
        { id: "sql_files", label: "Other Files" }
    ];
}

function renderTabs() {
    el.tabs.replaceChildren();

    categoryList().forEach((category, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.category = category.id;
        button.textContent = category.label;
        if (index === 0) button.classList.add("active");
        button.addEventListener("click", () => renderCategory(category.id));
        el.tabs.append(button);
    });
}

function renderCategory(category) {
    state.category = category;

    el.tabs.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === category);
    });

    const items = resources(category).filter((file) =>
        (file.path || file.name || "").toLowerCase().split(".").pop() !== "json"
    );
    el.count.textContent = items.length;
    el.list.replaceChildren();

    if (!items.length) {
        const p = document.createElement("p");
        p.className = "empty";
        p.textContent = `No ${category.replaceAll("_", " ")} resources found for this lab.`;
        el.list.append(p);
        el.file.textContent = "No file selected";

        if (category === "tasks" || category === "er_diagrams") {
            showTask();
            el.taskDescription.textContent = "No resource is available in this category.";
        } else {
            showEditor();
            setEditorValue("");
        }

        if (category === "queries" && !state.isErLab) {
            const newButton = document.createElement("button");
            newButton.type = "button";
            newButton.className = "resource-item new-query";
            newButton.innerHTML = '<span class="file-icon">+</span><span><span class="file-name">NEW QUERY</span><span class="file-path">Write SQL for this session</span></span>';
            newButton.addEventListener("click", () => {
                el.list.querySelectorAll(".resource-item").forEach((node) => node.classList.toggle("active", node === newButton));
                startNewQuery();
            });
            el.list.append(newButton);
        }
        return;
    }

    items.forEach((file) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "resource-item";

        const icon = document.createElement("span");
        icon.className = "file-icon";
        const ext = (file.name || file.path || "FILE").split(".").pop().toUpperCase();
        icon.textContent = ext.length > 4 ? "FILE" : ext;

        const details = document.createElement("span");
        const name = document.createElement("span");
        name.className = "file-name";
        name.textContent = file.name || file.path || "Unnamed resource";

        const path = document.createElement("span");
        path.className = "file-path";
        path.textContent = file.path || "";

        details.append(name, path);
        button.append(icon, details);
        button.addEventListener("click", () => openResource(file, button));
        el.list.append(button);
    });

    if (category === "queries" && !state.isErLab) {
        const newButton = document.createElement("button");
        newButton.type = "button";
        newButton.className = "resource-item new-query";
        newButton.innerHTML = '<span class="file-icon">+</span><span><span class="file-name">NEW QUERY</span><span class="file-path">Write SQL for this session</span></span>';
        newButton.addEventListener("click", () => {
            el.list.querySelectorAll(".resource-item").forEach((node) => node.classList.toggle("active", node === newButton));
            startNewQuery();
        });
        el.list.append(newButton);
    }

    el.list.querySelector(".resource-item:not(.new-query)")?.click();
}

function renderResults(resultSets) {
    el.results.replaceChildren();

    if (!resultSets.length) {
        const p = document.createElement("p");
        p.className = "message";
        p.textContent = "Statement executed successfully. No result table was returned.";
        el.results.append(p);
        return;
    }

    resultSets.forEach((result) => {
        const wrap = document.createElement("div");
        wrap.className = "table-wrap";

        const table = document.createElement("table");
        table.className = "result-table";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        result.columns.forEach((column) => {
            const th = document.createElement("th");
            th.textContent = column;
            headerRow.append(th);
        });

        thead.append(headerRow);
        table.append(thead);

        const tbody = document.createElement("tbody");

        result.values.forEach((row) => {
            const tr = document.createElement("tr");

            row.forEach((value) => {
                const td = document.createElement("td");
                td.textContent = value === null ? "NULL" : String(value);
                tr.append(td);
            });

            tbody.append(tr);
        });

        if (!result.values.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = Math.max(result.columns.length, 1);
            td.textContent = "No rows returned.";
            tr.append(td);
            tbody.append(tr);
        }

        table.append(tbody);
        wrap.append(table);
        el.results.append(wrap);
    });
}

function refreshTableList() {
    if (!state.db) return;

    const result = state.db.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );

    const names = result.length ? result[0].values.map((row) => row[0]) : [];
    const previous = el.editorTableSelect.value;

    el.editorTableSelect.replaceChildren();

    if (!names.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No tables available";
        el.editorTableSelect.append(option);
        el.editorLiveTable.innerHTML = '<p class="muted">No tables yet. Run migrations and seeds first.</p>';
        return;
    }

    names.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        el.editorTableSelect.append(option);
    });

    if (names.includes(previous)) el.editorTableSelect.value = previous;
    renderLiveTable();
}

function renderLiveTable() {
    const tableName = el.editorTableSelect.value;
    if (!state.db || !tableName) return;

    // Quote identifiers safely for SQLite.
    const safeName = `"${tableName.replaceAll('"', '""')}"`;
    try {
        const result = state.db.exec(`SELECT * FROM ${safeName} LIMIT 500;`);
        el.editorLiveTable.replaceChildren();

        if (!result.length) {
            const p = document.createElement("p");
            p.className = "muted";
            p.textContent = `Table "${tableName}" has no columns or returned no data.`;
            el.editorLiveTable.append(p);
            return;
        }

        renderTableInto(el.editorLiveTable, result[0]);
        log(`Viewed table ${tableName}.`, "command");
    } catch (error) {
        log(`Could not view ${tableName}: ${error.message}`, "error");
    }
}

function renderTableInto(target, result) {
    target.replaceChildren();

    const wrap = document.createElement("div");
    wrap.className = "table-wrap";

    const table = document.createElement("table");
    table.className = "result-table";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    result.columns.forEach((column) => {
        const th = document.createElement("th");
        th.textContent = column;
        trHead.append(th);
    });

    thead.append(trHead);
    table.append(thead);

    const tbody = document.createElement("tbody");
    result.values.forEach((row) => {
        const tr = document.createElement("tr");
        row.forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value === null ? "NULL" : String(value);
            tr.append(td);
        });
        tbody.append(tr);
    });

    if (!result.values.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = Math.max(result.columns.length, 1);
        td.textContent = "No rows in this table.";
        tr.append(td);
        tbody.append(tr);
    }

    table.append(tbody);
    wrap.append(table);
    target.append(wrap);
}

function execute(sql, label = "SQL") {
    if (!state.db) {
        status("DATABASE NOT READY", true);
        log("SQLite engine is not ready.", "error");
        return false;
    }

    if (!sql.trim()) {
        status("EMPTY SQL", true);
        log("Nothing to execute.", "error");
        return false;
    }

    log(`> ${label}`, "command");

    try {
        renderResults(state.db.exec(sql));
        status("EXECUTED");
        log(`${label} executed successfully.`, "success");
        if (state.viewingTables) refreshTableList();
        return true;
    } catch (error) {
        status("SQL ERROR", true);
        el.results.replaceChildren();

        const p = document.createElement("p");
        p.className = "message error";
        p.textContent = error.message;
        el.results.append(p);

        log(error.message, "error");
        return false;
    }
}

async function runFiles(category) {
    const items = resources(category).filter((file) =>
        (file.path || "").toLowerCase().endsWith(".sql")
    );

    if (!items.length) {
        log(`No SQL files to run in ${category}.`, "muted");
        return true;
    }

    for (const file of items) {
        try {
            const response = await fetch(resourceUrl(file.path));
            if (!response.ok) {
                throw new Error(`Could not load ${file.path} (${response.status})`);
            }

            const sql = await response.text();
            setEditorValue(sql);
            el.file.textContent = file.name || file.path;

            if (!execute(sql, file.name || file.path)) {
                log(`Stopped while running ${category}.`, "error");
                return false;
            }
        } catch (error) {
            status("RESOURCE ERROR", true);
            log(error.message, "error");
            return false;
        }
    }

    return true;
}

async function rebuild() {
    if (!state.SQL) {
        log("SQLite engine is not ready.", "error");
        return;
    }

    try {
        state.db?.close();
        state.db = new state.SQL.Database();
        el.results.replaceChildren();

        log("Database reset.", "warning");

        if (!await runFiles("migrations")) return;
        if (!await runFiles("seeds")) return;

        status("DATABASE READY");
        log("Database rebuilt from migrations and seeds.", "success");
        refreshTableList();
    } catch (error) {
        status("REBUILD ERROR", true);
        log(error.message, "error");
    }
}

async function initEngine() {
    if (typeof initSqlJs !== "function") {
        status("ENGINE UNAVAILABLE", true);
        log("SQL.js failed to load. Check internet access/CDN availability.", "error");
        return;
    }

    try {
        state.SQL = await initSqlJs({
            locateFile: (file) =>
                `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });

        state.db = new state.SQL.Database();
        log("SQLite engine ready. Data is temporary in this browser session.", "success");
    } catch (error) {
        status("ENGINE ERROR", true);
        log(error.message, "error");
    }
}

async function loadLab() {
    if (!labFolder || !/^LAB-[A-Za-z0-9_-]+$/.test(labFolder)) {
        el.title.textContent = "No lab selected";
        el.description.textContent = "Return to the subject page and choose a lab.";
        el.error.hidden = false;
        el.error.textContent = "Missing or invalid lab identifier. Expected a folder like LAB-3.";
        return;
    }

    try {
        const response = await fetch(`../${labFolder}/index.json`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Could not load ../${labFolder}/index.json (${response.status})`);
        }

        state.manifest = await response.json();
        if (!state.manifest || typeof state.manifest !== "object" || !state.manifest.resources) {
            throw new Error(`Invalid lab manifest for ${labFolder}. Regenerate its index.json.`);
        }
        state.manifest.resources ||= {};
        state.isErLab = ["LAB-1", "LAB-2"].includes(labFolder);
        document.querySelector(".outputs").hidden = state.isErLab;
        el.editorViewToggle.hidden = state.isErLab;

        const allCategories = [
            "tasks", "er_diagrams", "migrations", "seeds", "queries", "sql_files"
        ];

        allCategories.forEach((category) => {
            if (!Array.isArray(state.manifest.resources[category])) {
                state.manifest.resources[category] = [];
            }
        });

        el.title.textContent = state.manifest.name || labFolder;
        el.description.textContent =
            state.manifest.description ||
            "Browse resources, edit SQL, and run it in the local SQLite playground.";

        renderTabs();

        const total = categoryList().reduce(
            (sum, category) => sum + resources(category.id).length,
            0
        );

        log(`Loaded ${labFolder} manifest with ${total} resources.`, "success");
        renderCategory(categoryList()[0].id);
    } catch (error) {
        el.error.hidden = false;
        el.error.textContent =
            `${error.message}. Ensure this lab contains a valid index.json.`;
        el.description.textContent = "Unable to load lab resources.";
        log(error.message, "error");
    }
}

function toggleDatabaseView() {
    if (state.isErLab) return;
    state.viewingTables = !state.viewingTables;
    el.console.hidden = state.viewingTables;
    const cm = el.editorWrap.querySelector(".CodeMirror");
    if (cm) cm.hidden = state.viewingTables;
    el.editorWrap.querySelectorAll(".sql-action").forEach((button) => {
        button.hidden = state.viewingTables;
    });
    el.editorDatabaseView.hidden = !state.viewingTables;
    el.editorViewToggle.textContent = state.viewingTables ? "SHOW EDITOR" : "VIEW TABLES";
    if (state.viewingTables) refreshTableList();
}

function resizeFrame() {
    const app = document.querySelector(".app");
    const height = Math.ceil(Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        app?.getBoundingClientRect().height || 0
    ));
    parent.postMessage({ type: "troal-playground-height", height }, location.origin);
}

const resizeObserver = new ResizeObserver(resizeFrame);
resizeObserver.observe(document.body);
resizeObserver.observe(document.querySelector(".app"));
window.addEventListener("load", resizeFrame);
window.addEventListener("resize", resizeFrame);

if (typeof CodeMirror === "function") {
    state.editor = CodeMirror.fromTextArea(el.editor, {
        mode: "text/x-sql",
        lineNumbers: true,
        indentWithTabs: false,
        tabSize: 4,
        lineWrapping: true,
        theme: "troal"
    });
}

$("#run-sql").addEventListener("click", () => execute(getEditorValue(), "Editor SQL"));
$("#run-migrations").addEventListener("click", () => runFiles("migrations"));
$("#run-seeds").addEventListener("click", () => runFiles("seeds"));
$("#rebuild-db").addEventListener("click", rebuild);

$("#clear-results").addEventListener("click", () => {
    el.results.replaceChildren();
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Results cleared.";
    el.results.append(p);
});

$("#clear-console").addEventListener("click", () => {
    el.console.replaceChildren();
    log("Console cleared.", "muted");
});

el.editorViewToggle.addEventListener("click", toggleDatabaseView);
el.editorTableSelect.addEventListener("change", renderLiveTable);
$("#editor-refresh-table").addEventListener("click", refreshTableList);

initEngine();
loadLab();