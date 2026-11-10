/*
 * circuit.js — lightweight viewer for Logisim (.circ) files.
 *
 * A .circ file is XML: <project><lib/>…<main name=""/><circuit name=""> with
 * <comp loc="(x,y)" name="AND Gate"> and <wire from="(x,y)" to="(x,y)">.
 * This draws a layout preview (components + wires), lists the components and
 * offers the original file for download. It does not simulate the circuit.
 *
 * Usage: CircuitView.show(containerElement, url, displayName)
 */
(function (root) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  // Colours follow the site palette. Keyed by Logisim library description.
  const KINDS = {
    pin:        { label: "Pins",             fill: "#c8f169" },
    gate:       { label: "Gates",            fill: "#ff8fc7" },
    plexer:     { label: "Plexers",          fill: "#ffb86b" },
    arithmetic: { label: "Arithmetic",       fill: "#c7b5ff" },
    memory:     { label: "Memory",           fill: "#a8f0d0" },
    io:         { label: "Input / Output",   fill: "#fff27a" },
    other:      { label: "Other components", fill: "#9bd8ff" }
  };

  const parsePoint = (v) => {
    const m = (v || "").match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
    return m ? { x: +m[1], y: +m[2] } : null;
  };

  function libraryKinds(doc) {
    const map = {};
    doc.querySelectorAll(":scope > lib").forEach((lib) => {
      const desc = (lib.getAttribute("desc") || "").toLowerCase();
      let kind = "other";
      if (desc.includes("gates")) kind = "gate";
      else if (desc.includes("plexers")) kind = "plexer";
      else if (desc.includes("arithmetic")) kind = "arithmetic";
      else if (desc.includes("memory")) kind = "memory";
      else if (desc.includes("input")) kind = "io";
      map[lib.getAttribute("name")] = kind;
    });
    return map;
  }

  function kindOf(comp, libs) {
    const name = comp.getAttribute("name") || "";
    if (/^pin$/i.test(name)) return "pin";
    return libs[comp.getAttribute("lib")] || "other";
  }

  function attrText(comp) {
    return [...comp.querySelectorAll(":scope > a")]
      .map((a) => `${a.getAttribute("name")}=${a.getAttribute("val")}`)
      .join(", ");
  }

  function labelOf(comp) {
    const a = [...comp.querySelectorAll(":scope > a")]
      .find((n) => n.getAttribute("name") === "label");
    return a ? a.getAttribute("val") : "";
  }

  function el(tag, props, children) {
    const n = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === "text") n.textContent = v;
      else if (k === "class") n.className = v;
      else n.setAttribute(k, v);
    });
    (children || []).forEach((c) => n.append(c));
    return n;
  }

  function svgNode(tag, attrs, parent) {
    const n = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.append(n);
    return n;
  }

  function drawCircuit(circuit, libs) {
    const comps = [...circuit.querySelectorAll(":scope > comp")]
      .map((c) => ({
        node: c,
        name: c.getAttribute("name") || "Component",
        p: parsePoint(c.getAttribute("loc")),
        kind: kindOf(c, libs),
        label: labelOf(c),
        attrs: attrText(c)
      }))
      .filter((c) => c.p);

    const wires = [...circuit.querySelectorAll(":scope > wire")]
      .map((w) => ({ a: parsePoint(w.getAttribute("from")), b: parsePoint(w.getAttribute("to")) }))
      .filter((w) => w.a && w.b);

    const pts = [...comps.map((c) => c.p), ...wires.flatMap((w) => [w.a, w.b])];
    if (!pts.length) return null;

    const minX = Math.min(...pts.map((p) => p.x)) - 50;
    const maxX = Math.max(...pts.map((p) => p.x)) + 70;
    const minY = Math.min(...pts.map((p) => p.y)) - 50;
    const maxY = Math.max(...pts.map((p) => p.y)) + 50;
    const width = Math.max(300, maxX - minX);
    const height = Math.max(180, maxY - minY);

    const svg = svgNode("svg", {
      viewBox: `${minX} ${minY} ${width} ${height}`,
      width, height,
      role: "img",
      "aria-label": "Circuit layout preview"
    });
    svg.setAttribute("class", "circuit-svg");

    // wires first, so components sit on top
    wires.forEach((w) =>
      svgNode("line", { x1: w.a.x, y1: w.a.y, x2: w.b.x, y2: w.b.y, stroke: "#171717", "stroke-width": 2 }, svg));

    comps.forEach((c) => {
      const pin = c.kind === "pin";
      const w = pin ? 18 : c.kind === "gate" ? 42 : 54;
      const h = pin ? 18 : c.kind === "gate" ? 32 : 28;
      const g = svgNode("g", {}, svg);
      svgNode("rect", {
        x: c.p.x - w / 2, y: c.p.y - h / 2, width: w, height: h,
        rx: pin ? 0 : 2, fill: KINDS[c.kind].fill, stroke: "#171717", "stroke-width": 2
      }, g);
      const t = svgNode("text", {
        x: c.p.x, y: c.p.y + 3, "text-anchor": "middle", "font-size": pin ? 7 : 9,
        "font-family": "monospace", "font-weight": "bold", fill: "#171717"
      }, g);
      t.textContent = pin ? "" : (c.name.length > 9 ? c.name.slice(0, 8) + "…" : c.name);
      if (c.label) {
        const l = svgNode("text", {
          x: c.p.x, y: c.p.y - h / 2 - 4, "text-anchor": "middle", "font-size": 9,
          "font-family": "monospace", "font-weight": "bold", fill: "#171717"
        }, g);
        l.textContent = c.label;
      }
    });

    return { svg, comps, wires };
  }

  function legend(comps) {
    const used = [...new Set(comps.map((c) => c.kind))];
    const wrap = el("div", { class: "legend" });
    used.forEach((k) => {
      const chip = el("span", { class: "legend-chip", text: KINDS[k].label });
      chip.style.background = KINDS[k].fill;
      wrap.append(chip);
    });
    return wrap;
  }

  function details(summary, build) {
    const d = el("details", { class: "circuit-details" }, [el("summary", { text: summary })]);
    d.append(build());
    return d;
  }

  async function show(box, url, name) {
    box.replaceChildren(el("p", { class: "empty", text: "Loading circuit…" }));

    const fail = (msg) => {
      box.replaceChildren(
        el("p", { class: "empty", text: msg + " Download the file and open it in Logisim Evolution." }),
        el("a", { class: "file-button", href: url, download: "", text: `DOWNLOAD ${name} ↓` })
      );
    };

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not load the circuit file.");
      const raw = await res.text();

      const doc = new DOMParser().parseFromString(raw, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("This file is not valid Logisim XML.");

      const project = doc.documentElement;
      const libs = libraryKinds(project);
      const circuits = [...project.querySelectorAll(":scope > circuit")];
      if (!circuits.length) throw new Error("No circuit was found in this file.");

      const mainName = (project.querySelector(":scope > main") || {}).getAttribute?.("name");
      let current = circuits.find((c) => c.getAttribute("name") === mainName) || circuits[0];

      const head = el("div", { class: "circuit-head" }, [
        el("strong", { text: name }),
        el("a", { class: "file-button", href: url, download: "", text: "DOWNLOAD .CIRC ↓" })
      ]);
      const picker = el("div", { class: "file-list circuit-picker" });
      const stage = el("div", { class: "circuit-stage" });

      const draw = () => {
        picker.querySelectorAll("button").forEach((b) =>
          b.classList.toggle("selected", b.dataset.name === current.getAttribute("name")));
        const drawn = drawCircuit(current, libs);
        if (!drawn) {
          stage.replaceChildren(el("p", { class: "empty", text: "This circuit has no positioned components or wires." }));
          return;
        }
        const { svg, comps, wires } = drawn;
        stage.replaceChildren(
          el("p", {
            class: "empty",
            text: `${comps.length} components · ${wires.length} wire segments. Layout preview only — use Logisim Evolution for exact symbols and simulation.`
          }),
          legend(comps),
          el("div", { class: "svg-wrap" }, [svg]),
          details(`COMPONENT INVENTORY (${comps.length})`, () => {
            const ul = el("ul", { class: "inventory" });
            comps.forEach((c) => ul.append(el("li", {
              text: `${c.label ? c.label + " · " : ""}${c.name} at (${c.p.x}, ${c.p.y})${c.attrs ? " — " + c.attrs : ""}`
            })));
            return ul;
          }),
          details("VIEW CIRCUIT XML", () => el("pre", { text: raw }))
        );
        root.dispatchEvent(new Event("troal-circuit-drawn"));
      };

      if (circuits.length > 1) {
        circuits.forEach((c) => {
          const b = el("button", { class: "file-button", type: "button", text: c.getAttribute("name") || "circuit" });
          b.dataset.name = c.getAttribute("name");
          b.addEventListener("click", () => { current = c; draw(); });
          picker.append(b);
        });
      }

      box.replaceChildren(head, ...(circuits.length > 1 ? [picker] : []), stage);
      draw();
    } catch (e) {
      fail(e.message || "Could not read the circuit.");
    }
  }

  root.CircuitView = { show };
})(window);
