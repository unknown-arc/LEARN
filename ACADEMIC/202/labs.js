const grid = document.querySelector("#lab-grid");
const section = document.querySelector("#playground-section");
const frame = document.querySelector("#playground-frame");
const closeBtn = document.querySelector("#close-playground");

function openLab(lab) {
    const title =
        document.querySelector("#playground-title") ||
        document.querySelector("#active-lab-title");

    if (!title) {
        console.error(
            "Playground title element not found. Check the HTML loaded by this page."
        );
        return;
    }

    if (!/^LAB-[A-Za-z0-9_-]+$/.test(lab.folder || "")) {
        console.error("Invalid lab folder:", lab.folder);
        return;
    }

    title.textContent = lab.name || lab.folder;
    frame.src = `./playgrounds/index.html?lab=${encodeURIComponent(lab.folder)}`;

    section.hidden = false;
    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

async function loadLabs() {
    try {
        const response = await fetch("./labs.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`labs.json returned ${response.status}`);
        }

        const labs = await response.json();

        if (!grid) {
            throw new Error('Missing element: "#lab-grid"');
        }

        grid.replaceChildren();

        if (!Array.isArray(labs) || labs.length === 0) {
            const p = document.createElement("p");
            p.className = "empty-message";
            p.textContent = "No labs found.";
            grid.append(p);
            return;
        }

        labs.forEach((lab, i) => {
            if (!lab || !/^LAB-[A-Za-z0-9_-]+$/.test(lab.folder || "")) {
                console.warn("Skipping invalid lab:", lab);
                return;
            }

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
        console.error("Unable to load labs:", error);

        if (grid) {
            grid.textContent =
                "Unable to load labs.json. Check the file and local server.";
        }
    }
}

closeBtn?.addEventListener("click", () => {
    if (frame) {
        frame.src = "about:blank";
    }

    if (section) {
        section.hidden = true;
    }
});

loadLabs();