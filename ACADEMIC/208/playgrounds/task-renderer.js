// Turns the plain text of a Task.txt into a designed page.
// Nothing is rendered as HTML: every piece is built with textContent, so the
// text file can never inject markup.
//
// How the lines are read:
//   first line                     -> small heading ("Class Activity")
//   "Subject: ..." at the top      -> info chips
//   LAB-5                          -> lab badge
//   "Assignment: ..."              -> big title
//   "Objective: ..."               -> highlighted box
//   "1. Header and Navigation"     -> numbered card (everything below goes inside it)
//   short line, no full stop       -> section heading
//   line ending with ":"           -> the lines after it become a bullet list
//   "Home | Gallery | Contact"     -> row of chips (text before a ":" becomes its label)
//   anything else                  -> paragraph

const BOX_LABELS = ["objective", "aim", "goal", "note", "notes", "important", "instructions"];

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeChips(text) {
  const row = make("div", "chips");
  text.split("|").forEach((part, index) => {
    row.append(make("span", `chip c${index % 3}`, part.trim()));
  });
  return row;
}

// "Key: value" -> <b>Key:</b> value
function makeKeyValue(tag, key, value) {
  const node = make(tag);
  node.append(make("b", "", `${key}: `), value);
  return node;
}

function renderTask(text) {
  const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim());

  const page = make("article", "task");
  const head = make("header", "task-head");
  page.append(head);

  let target = page;       // where new content goes: the page or the current card
  let list = null;         // the bullet list being filled
  let listMode = false;    // true after a line that ends with ":"
  let blankLines = 0;
  let meta = null;         // row of info chips at the top
  let cardCount = 0;
  let started = false;
  let titleSeen = false;

  const atTop = () => cardCount === 0 && !titleSeen;

  function endList() {
    listMode = false;
    list = null;
  }

  lines.forEach((line) => {
    if (!line) {
      blankLines += 1;
      if (blankLines >= 2) endList();   // two blank lines end a list
      return;
    }

    const afterBlank = blankLines > 0;
    blankLines = 0;

    // First line of the file, e.g. "Class Activity"
    if (!started) {
      started = true;
      if (!line.includes(":") && line.length <= 40) {
        head.append(make("p", "task-kicker", line));
        return;
      }
    }

    // LAB-5
    if (/^LAB[\s-]*\d+$/i.test(line)) {
      head.append(make("span", "lab-badge", line.toUpperCase()));
      return;
    }

    // 1. Header and Navigation Bar  -> new numbered card
    const numbered = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (numbered && line.length <= 80) {
      const card = make("section", `card c${cardCount % 3}`);
      const title = make("h3", "card-title");
      title.append(make("span", "card-number", numbered[1]), numbered[2]);
      const body = make("div", "card-body");

      card.append(title, body);
      page.append(card);
      target = body;
      cardCount += 1;
      endList();
      return;
    }

    // Home | Gallery | Contact   or   "Popular places: Puri | Tirupati"
    if (line.includes("|")) {
      const colon = line.indexOf(":");
      if (colon !== -1 && colon < line.indexOf("|")) {
        target.append(make("p", "lead", line.slice(0, colon + 1)));
        target.append(makeChips(line.slice(colon + 1)));
      } else {
        target.append(makeChips(line));
      }
      return;
    }

    // Assignment: Incredible India  -> big title
    const titleMatch = line.match(/^(assignment|title|experiment|project)\s*:\s*(.+)$/i);
    if (titleMatch) {
      head.append(make("p", "task-label", titleMatch[1].toUpperCase()));
      head.append(make("h2", "task-title", titleMatch[2]));
      titleSeen = true;
      return;
    }

    // Key: value
    const pair = line.match(/^([A-Za-z][A-Za-z ]{0,24}):\s+(.+)$/);
    if (pair) {
      const [, key, value] = pair;

      if (atTop()) {
        // "Subject: ..." and "Dates: ..." at the top of the file
        if (!meta) {
          meta = make("div", "task-meta");
          head.append(meta);
        }
        meta.append(makeKeyValue("span", key, value));
      } else if (BOX_LABELS.includes(key.toLowerCase())) {
        const box = make("div", "callout");
        box.append(make("b", "callout-label", key.toUpperCase()), make("p", "", value));
        target.append(box);
      } else if (listMode) {
        if (!list) {
          list = make("ul", "task-list");
          target.append(list);
        }
        list.append(makeKeyValue("li", key, value));
      } else {
        target.append(makeKeyValue("p", key, value));
      }
      return;
    }

    // "Each card must contain:"  -> the lines below become a list
    if (line.endsWith(":")) {
      target.append(make("p", "lead", line));
      listMode = true;
      list = null;
      return;
    }

    const endsWithFullStop = /[.!?]$/.test(line);

    // A line after a blank that ends with a full stop closes the list
    if (listMode && !(afterBlank && endsWithFullStop)) {
      if (!list) {
        list = make("ul", "task-list");
        target.append(list);
      }
      list.append(make("li", "", line));
      return;
    }

    endList();

    // Short line with no full stop -> section heading
    if (afterBlank && line.length <= 60 && !endsWithFullStop) {
      target = page;
      page.append(make("h2", "section-title", line));
      return;
    }

    target.append(make("p", "", line));
  });

  return page;
}
