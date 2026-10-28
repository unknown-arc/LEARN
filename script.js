const cards = document.querySelectorAll(".choice-card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.add("is-selected");
  });
});