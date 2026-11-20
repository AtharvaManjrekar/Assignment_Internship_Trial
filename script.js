const $ = (s) => document.querySelector(s);
// mobile menu
const nav = $("#nav"),
  burger = $("#burger");
burger.onclick = () => {
  const o = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
};
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") nav.classList.remove("open");
});
// interactive shift board: 0 open, 1 morning, 2 afternoon, 3 off
const names = ["Maya", "Dev", "Sana", "Tom"],
  days = ["Mon", "Tue", "Wed", "Thu", "Fri"],
  lab = ["Open", "AM", "PM", "Off"];
const st = [
  [1, 1, 0, 2, 2],
  [2, 3, 1, 1, 0],
  [3, 2, 2, 0, 1],
  [1, 0, 1, 3, 2],
];
const grid = $("#grid");
grid.innerHTML =
  "<span></span>" +
  days.map((d) => `<span class="h">${d}</span>`).join("") +
  names
    .map(
      (n, r) =>
        `<span class="n">${n}</span>` +
        days
          .map(
            (d, c) =>
              `<button class="cell" data-r="${r}" data-c="${c}" aria-label="${n}, ${d}"></button>`,
          )
          .join(""),
    )
    .join("");
function paint() {
  let o = 0;
  grid.querySelectorAll(".cell").forEach((b) => {
    const v = st[b.dataset.r][b.dataset.c];
    b.dataset.s = v;
    b.textContent = lab[v];
    if (v === 0) o++;
  });
  $("#open").textContent = o;
}
grid.onclick = (e) => {
  const b = e.target.closest(".cell");
  if (!b) return;
  const r = b.dataset.r,
    c = b.dataset.c;
  st[r][c] = (st[r][c] + 1) % 4;
  paint();
};
paint();
// pricing toggle
function bill(y) {
  $("#mo").setAttribute("aria-pressed", !y);
  $("#yr").setAttribute("aria-pressed", y);
  document
    .querySelectorAll(".amt")
    .forEach((a) => (a.textContent = "$" + (y ? a.dataset.y : a.dataset.m)));
}
$("#mo").onclick = () => bill(false);
$("#yr").onclick = () => bill(true);
// plan buttons preselect the form
document.querySelectorAll("[data-plan]").forEach((a) =>
  a.addEventListener("click", () => {
    $("#plan").value = a.dataset.plan;
  }),
);
// form validation
const f = $("#form");
function bad(el, msg) {
  el.setAttribute("aria-invalid", !!msg);
  el.parentElement.querySelector(".err").textContent = msg || "";
  return !!msg;
}
f.addEventListener("submit", (e) => {
  e.preventDefault();
  const n = $("#name"),
    m = $("#email");
  const e1 = bad(
    n,
    n.value.trim().length < 2 ? "Enter your name (at least 2 characters)." : "",
  );
  const e2 = bad(
    m,
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim())
      ? "Enter a valid email, like you@cafe.com."
      : "",
  );
  if (e1 || e2) return;
  const ok = $("#ok");
  ok.style.display = "block";
  ok.textContent = `Thanks ${n.value.trim().split(" ")[0]}, your demo request for the ${$("#plan").value} plan is in. We’ll email ${m.value.trim()} within one working day.`;
  f.reset();
});
