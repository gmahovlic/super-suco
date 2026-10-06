// Proporções por tipo de limão (quantidades para `peel` gramas de casca)
const RECIPES = {
  taiti: {
    peel: 15, citric: 10, malic: 5, water: 250,
    title: "de Limão", emoji: "🍋‍🟩", heart: "💚", peelColor: "verde",
    themeColor: "#8fd14f", favicon: ["#8fd14f", "#3f8a24"],
  },
  siciliano: {
    peel: 50, citric: 50, malic: 0, water: 800,
    title: "de Limão Siciliano", emoji: "🍋", heart: "💛", peelColor: "amarela",
    themeColor: "#ffe14d", favicon: ["#ffe14d", "#e0a800"],
  },
};

const $ = (id) => document.getElementById(id);
const input = $("peel");
const tabs = document.querySelectorAll('[role="tab"]');
let fruit = "taiti";

const fmt = (n, digits = 1) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: digits });

function formatVolume(ml) {
  return ml >= 1000 ? { value: fmt(ml / 1000, 2), unit: "L" } : { value: fmt(ml, 0), unit: "ml" };
}

function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function update() {
  const r = RECIPES[fruit];
  const peel = Math.max(0, parseFloat(input.value.replace(",", ".")) || 0);
  const k = peel / r.peel;

  $("out-citric").textContent = fmt(r.citric * k);
  $("out-malic").textContent = fmt(r.malic * k);

  const water = formatVolume(r.water * k);
  $("out-water").textContent = water.value;
  $("out-water-unit").textContent = water.unit;
  $("out-yield").textContent = `${water.value} ${water.unit}`;

  document.querySelectorAll(".val b").forEach(bump);
  document.querySelectorAll(".chips button").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.g) === peel)
  );
}

function setFruit(next) {
  fruit = RECIPES[next] ? next : "taiti";
  const r = RECIPES[fruit];

  document.body.dataset.fruit = fruit;
  tabs.forEach((t) => {
    const on = t.dataset.fruit === fruit;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
  });

  $("title-fruit").textContent = r.title;
  $("heart").textContent = r.heart;
  $("peel-color").textContent = r.peelColor;
  $("row-malic").hidden = !r.malic;
  $("acids").textContent = r.malic ? "o ácido cítrico e o ácido málico" : "o ácido cítrico";
  $("ratio").textContent =
    `Proporção: ${r.peel} g casca · ${r.citric} g cítrico` +
    (r.malic ? ` · ${r.malic} g málico` : "") +
    ` · ${r.water} ml água`;
  document.querySelectorAll(".fruit-emoji").forEach((e) => (e.textContent = r.emoji));

  document.querySelector('meta[name="theme-color"]').content = r.themeColor;
  const [fill, stroke] = r.favicon;
  $("favicon").href = "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="52" r="42" fill="${fill}" stroke="${stroke}" stroke-width="6"/></svg>`
  );

  history.replaceState(null, "", fruit === "taiti" ? location.pathname : `#${fruit}`);
  update();
}

input.addEventListener("input", update);
document.querySelectorAll(".chips button").forEach((b) =>
  b.addEventListener("click", () => {
    input.value = b.dataset.g;
    update();
  })
);

tabs.forEach((t, i) => {
  t.addEventListener("click", () => setFruit(t.dataset.fruit));
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    next.focus();
    setFruit(next.dataset.fruit);
  });
});

setFruit(location.hash.slice(1));
