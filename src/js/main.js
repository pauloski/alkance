/* Vanilla JS, sin dependencias. Cargado con `defer`.
 * Regla del sistema: el JS solo añade y quita clases o atributos de estado.
 * Toda la apariencia vive en CSS. Ganchos vía data-*, nunca vía clases de estilo. */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --- Header: borde inferior al salir del tope --- */
/* Un centinela con IntersectionObserver evita escuchar scroll en cada frame. */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const sentinel = document.createElement("div");
  header.before(sentinel);

  new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting),
    { threshold: 1 }
  ).observe(sentinel);
}

/* --- Reveal al entrar en viewport, una sola vez --- */
function initReveal() {
  const items = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!items.length) return;

  if (REDUCED_MOTION) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // la entrada no se repite al volver a scrollear
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* --- Pestañas del modelo Stingray --- */
function initTabs() {
  const group = document.querySelector("[data-tabs]");
  if (!group) return;

  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  const select = (index) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      if (panels[i]) panels[i].hidden = i !== index;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));

    // Patrón de teclado APG: flechas mueven el foco entre pestañas.
    tab.addEventListener("keydown", (event) => {
      const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!delta) return;
      event.preventDefault();
      const next = (i + delta + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus();
    });
  });

  select(0);
}

/* --- Fondo en video de innovación --- */
/* El clip trae pista de audio: va siempre silenciado (y el autoplay lo exige).
 * Solo corre mientras la sección está a la vista; fuera, el póster basta. */
function initInnoVideo() {
  const video = document.querySelector(".inno__video");
  if (!video) return;

  video.muted = true;

  if (REDUCED_MOTION) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        const played = video.play();
        if (played) played.catch(() => {}); // el navegador puede negar el autoplay
      } else {
        video.pause();
      }
    },
    { threshold: 0.1 }
  ).observe(video);
}

/* --- Año dinámico del footer --- */
function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

/* El marquee es CSS puro (ver .marquee en components.css): no necesita JS. */

initHeader();
initReveal();
initTabs();
initInnoVideo();
initYear();
