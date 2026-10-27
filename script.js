// Step 1: basic navigation interaction only.
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// The Academic card is a placeholder until its destination is decided.
document.querySelector(".academic-card")?.addEventListener("click", (event) => {
  event.preventDefault();
});
