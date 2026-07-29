/* Landing E-commerce Headless · vanilla JS (microinteracciones + formulario). */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---- Nav: sombra al hacer scroll ----
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // ---- Reveal + disparo del gráfico al entrar en viewport ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      if (e.target.id === "chart-card") dibujarLineas(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
  const chart = $("#chart-card");
  if (chart) io.observe(chart);

  // Dibuja las líneas del gráfico animando stroke-dashoffset con su largo real.
  function dibujarLineas(scope) {
    $$(".cline", scope).forEach((path, i) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect(); // fuerza reflow
      path.style.transition = `stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1) ${i * 0.18}s`;
      requestAnimationFrame(() => { path.style.strokeDashoffset = "0"; });
    });
  }

  // ---- Sticky CTA (móvil): aparece tras salir del hero ----
  const sticky = $("#sticky-cta");
  const hero = $(".hero");
  if (sticky && hero) {
    new IntersectionObserver(([e]) => {
      sticky.classList.toggle("show", !e.isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }

  // ---- Selección de plan: botones [data-plan] + parámetro ?plan= ----
  const radios = { full: $("#plan-full"), ecommerce: $("#plan-ecom") };
  function elegirPlan(clave) {
    const r = radios[clave];
    if (r) r.checked = true;
  }
  $$("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => elegirPlan(btn.dataset.plan));
  });

  // ---- Captura de parámetros de la URL (marcaje / UTM / atribución) ----
  const params = new URLSearchParams(location.search);
  const planParam = (params.get("plan") || "").toLowerCase();
  if (planParam === "full" || planParam === "ecommerce") elegirPlan(planParam);

  const CAMPOS_MARCAJE = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ref", "marcaje"];
  const marcaje = {};
  CAMPOS_MARCAJE.forEach((k) => { const v = params.get(k); if (v) marcaje[k] = v.slice(0, 120); });
  marcaje.landing = "ecommerce-headless";
  marcaje.url = location.href.slice(0, 300);
  if (document.referrer) marcaje.referrer = document.referrer.slice(0, 200);

  // ---- Envío del formulario ----
  const form = $("#lead-form");
  const msg = $("#lead-msg");
  const okState = $("#lead-ok");
  const submitBtn = $("#lead-submit");
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    const datos = Object.fromEntries(new FormData(form));

    if (datos.web) return; // honeypot: bot
    if (!datos.nombre?.trim() || !datos.email?.trim()) {
      msg.className = "form-msg err"; msg.textContent = "Escribe al menos tu nombre y correo.";
      return;
    }
    if (!EMAIL_OK.test(datos.email.trim())) {
      msg.className = "form-msg err"; msg.textContent = "Ese correo no parece válido.";
      return;
    }

    submitBtn.disabled = true;
    const textoOriginal = submitBtn.textContent;
    submitBtn.textContent = "Enviando…";
    msg.textContent = "";

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, marcaje }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.ok) throw new Error(body.error || "fallo");
      form.hidden = true;
      okState.hidden = false;
      okState.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = textoOriginal;
      msg.className = "form-msg err";
      msg.textContent = "No pudimos enviar tu mensaje. Escríbenos a contacto@alkancedigital.cl";
    }
  });
})();
