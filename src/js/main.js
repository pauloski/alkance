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

/* --- Formulario de contacto --- */
/* Mejora progresiva: el <form> ya funciona solo. Sin este JS hace un POST
 * nativo y la Function responde con un 303 a /?envio=ok, que initAvisoEnvio()
 * convierte en mensaje. Lo único que aporta el JS es evitar la recarga.
 * Se respeta la regla del sistema: el JS mueve atributos de estado
 * (data-enviando, data-estado) y la apariencia entera vive en CSS. */
function initContactForm() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const estado = form.querySelector("[data-form-estado]");

  const decir = (texto, tipo) => {
    estado.textContent = texto;
    estado.dataset.estado = tipo;
  };

  form.addEventListener("submit", async (event) => {
    // Deja que el navegador muestre sus propios avisos de campo obligatorio.
    if (!form.checkValidity()) return;

    event.preventDefault();
    if (form.dataset.enviando !== undefined) return; // doble clic

    form.dataset.enviando = "";
    decir("Enviando…", "");

    try {
      const respuesta = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const datos = await respuesta.json().catch(() => ({}));

      if (respuesta.ok && datos.ok) {
        form.reset();
        decir("Gracias. Te responderemos pronto.", "ok");
      } else {
        decir(datos.error || "No pudimos enviar el mensaje. Escríbenos a hola@alkance.cl.", "error");
      }
    } catch {
      // Red caída o sin conexión: fetch rechaza antes de llegar al servidor.
      decir("Revisa tu conexión e inténtalo de nuevo.", "error");
    } finally {
      delete form.dataset.enviando;
    }
  });
}

/* --- Aviso tras un envío sin JavaScript --- */
/* La Function redirige a /?envio=ok|error. Se traduce a texto y se limpia la
 * URL, para que recargar no vuelva a mostrar el aviso. */
function initAvisoEnvio() {
  const envio = new URLSearchParams(location.search).get("envio");
  if (!envio) return;

  const estado = document.querySelector("[data-form-estado]");
  if (estado) {
    estado.textContent =
      envio === "ok"
        ? "Gracias. Te responderemos pronto."
        : "No pudimos enviar el mensaje. Escríbenos a hola@alkance.cl.";
    estado.dataset.estado = envio === "ok" ? "ok" : "error";
  }

  history.replaceState(null, "", location.pathname + location.hash);
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
initContactForm();
initAvisoEnvio();
initYear();
