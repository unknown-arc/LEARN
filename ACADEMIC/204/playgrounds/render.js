/*
 * render.js — turns a lab's Task.txt into a designed task sheet.
 *
 * Task.txt uses a light, chat-style markup:
 *   *LAB-3*                  title (or plain "LAB-3")
 *   Date: *8 Sept, 2026*     date line
 *   *Task:*                  section heading (a line ending in ":")
 *   * item                   bullet (also "- item")
 *   *bold*                   inline emphasis
 *   *Note:* text             callout
 *
 * Usage: TaskRender.render(text) -> HTML string
 *        TaskRender.mount(element, text)
 */
(function (root) {
  "use strict";

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  // *bold* -> <mark><strong>…</strong></mark> (input is escaped first)
  const inline = (s) =>
    esc(s).replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>");

  // Strip the asterisks that wrap a whole line: "*Task:*" -> "Task:"
  const unwrap = (s) => s.trim().replace(/^\*+\s*/, "").replace(/\s*\*+$/, "");

  const BULLET = /^\s*[*\-•]\s+(.*)$/;
  const DATE = /^\s*date\s*:\s*(.+)$/i;
  const HEADING = /^\s*\*?\s*([^*:]{1,40}?)\s*:\s*\*?\s*$/;
  const NOTE = /^\s*\*?\s*(note|hint)\s*:\s*\*?\s*(.*)$/i;
  const TITLE = /^\s*\*?\s*(LAB[\s-]*[A-Za-z0-9_-]+)\s*\*?\s*$/i;

  function parse(text) {
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    const doc = { title: "", date: "", blocks: [] };
    let list = null;

    const closeList = () => { list = null; };

    for (const raw of lines) {
      if (!raw.trim()) { closeList(); continue; }

      if (!doc.title && TITLE.test(raw)) {
        doc.title = unwrap(raw).toUpperCase().replace(/\s+/g, "-");
        continue;
      }
      const date = raw.match(DATE);
      if (!doc.date && date) { doc.date = unwrap(date[1]); continue; }

      const bullet = raw.match(BULLET);
      if (bullet) {
        // "* Hint: …" inside a list becomes a hint item, not a plain bullet
        const hint = bullet[1].match(NOTE);
        if (!list) { list = { type: "list", items: [] }; doc.blocks.push(list); }
        list.items.push(hint
          ? { kind: hint[1].toLowerCase(), text: hint[2] }
          : { kind: "step", text: bullet[1] });
        continue;
      }
      closeList();

      const note = raw.match(NOTE);
      if (note) {
        doc.blocks.push({ type: "note", label: note[1], text: note[2] });
        continue;
      }
      const heading = raw.match(HEADING);
      if (heading) { doc.blocks.push({ type: "heading", text: heading[1] }); continue; }

      const last = doc.blocks[doc.blocks.length - 1];
      if (last && last.type === "para") last.text += " " + raw.trim();
      else doc.blocks.push({ type: "para", text: raw.trim() });
    }
    return doc;
  }

  function render(text) {
    const doc = parse(text);
    if (!doc.title && !doc.date && !doc.blocks.length) {
      return '<p class="empty">Task.txt is empty.</p>';
    }

    let step = 0;
    const out = [];

    out.push(
      '<header class="task-head">' +
        '<span class="task-eyebrow">TASK SHEET</span>' +
        (doc.title ? `<h2 class="task-title">${esc(doc.title)}<i>.</i></h2>` : "") +
        (doc.date ? `<span class="task-date"><b>DATE</b>${esc(doc.date)}</span>` : "") +
      "</header>"
    );

    for (const b of doc.blocks) {
      if (b.type === "heading") {
        out.push(`<h3 class="task-section"><span>${esc(b.text)}</span></h3>`);
      } else if (b.type === "list") {
        out.push(
          '<ol class="task-list">' +
            b.items.map((it) => {
              if (it.kind === "step") {
                step += 1;
                return `<li class="step"><b class="step-no">${String(step).padStart(2, "0")}</b><p>${inline(it.text)}</p></li>`;
              }
              return `<li class="hint"><b class="step-no">${it.kind === "note" ? "!" : "?"}</b><p><em>${esc(it.kind.toUpperCase())}</em> ${inline(it.text)}</p></li>`;
            }).join("") +
          "</ol>"
        );
      } else if (b.type === "note") {
        out.push(`<aside class="task-note"><strong>${esc(b.label.toUpperCase())}</strong><p>${inline(b.text)}</p></aside>`);
      } else {
        out.push(`<p class="task-para">${inline(b.text)}</p>`);
      }
    }
    return out.join("");
  }

  function mount(el, text) { el.innerHTML = render(text); }

  const api = { parse, render, mount };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TaskRender = api;
})(typeof window !== "undefined" ? window : globalThis);
