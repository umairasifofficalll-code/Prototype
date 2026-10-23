const menus = {
  grill: [
    ["Smoky seekh kebab", "Beef, green chilli, mint chutney", "Rs 1,250"],
    ["Charred chicken tikka", "Yogurt marinade, lemon, house spice", "Rs 1,450"],
    ["Grilled paneer plate", "Paneer, peppers, coriander", "Rs 1,100"]
  ],
  bread: [
    ["Tandoori naan", "Fresh from the clay oven", "Rs 180"],
    ["Roghni naan", "Sesame, a little butter", "Rs 260"],
    ["Laccha paratha", "Layered, crisp at the edges", "Rs 320"]
  ],
  sweet: [
    ["Warm gulab jamun", "Two pieces, cardamom syrup", "Rs 420"],
    ["Kulfi falooda", "Pistachio kulfi, rose, vermicelli", "Rs 560"],
    ["Kheer for the table", "Slow cooked rice pudding", "Rs 490"]
  ]
};

document.querySelectorAll(".menu-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".menu-tab").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    const target = document.querySelector("#menu-items");
    target.innerHTML = menus[tab.dataset.menu].map(([name, detail, price]) => `
      <article><div><h3>${name}</h3><p>${detail}</p></div><strong>${price}</strong></article>
    `).join("");
  });
});

document.querySelectorAll(".prototype-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const details = new FormData(form);
    const body = [...details.entries()].map(([key, value]) => `${key}: ${value}`).join("\n");
    const url = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  });
});

const revealItems = document.querySelectorAll("main section");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((section) => {
    section.classList.add("can-reveal");
    observer.observe(section);
  });
}
