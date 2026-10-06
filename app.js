// Proporção base: 15 g de casca
const BASE_PEEL = 15;
const PER_BASE = { citric: 10, malic: 5, water: 250 };

const $ = (id) => document.getElementById(id);
const input = $("peel");

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
  const peel = Math.max(0, parseFloat(input.value.replace(",", ".")) || 0);
  const k = peel / BASE_PEEL;

  $("out-citric").textContent = fmt(PER_BASE.citric * k);
  $("out-malic").textContent = fmt(PER_BASE.malic * k);

  const water = formatVolume(PER_BASE.water * k);
  $("out-water").textContent = water.value;
  $("out-water-unit").textContent = water.unit;

  $("out-yield").textContent = `${water.value} ${water.unit}`;

  document.querySelectorAll(".val b").forEach(bump);
  document.querySelectorAll(".chips button").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.g) === peel)
  );
}

input.addEventListener("input", update);
document.querySelectorAll(".chips button").forEach((b) =>
  b.addEventListener("click", () => {
    input.value = b.dataset.g;
    update();
  })
);

update();
