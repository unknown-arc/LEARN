const cards = document.querySelectorAll(".choice-card");

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();

    const section = card.dataset.section;
    const label = section === "academic" ? "ACADEMIC" : "INDEPENDENT";

    // Replace this demo interaction with your real section URL when ready.
    console.info(`${label} selected`);
    card.classList.add("is-selected");
    window.setTimeout(() => card.classList.remove("is-selected"), 220);
  });
});
