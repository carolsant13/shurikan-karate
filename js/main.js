(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const whatsappUrl = (text) =>
    "https://wa.me/" +
    config.whatsapp +
    (text ? "?text=" + encodeURIComponent(text) : "");

  /* ---------- Preenche dados de contato a partir do config.js ---------- */
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = whatsappUrl(
      "Olá! Gostaria de agendar uma aula experimental na Shurikan.",
    );
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = "https://instagram.com/" + config.instagram;
  });
  document.querySelectorAll("[data-maps]").forEach((el) => {
    el.href =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(config.address);
  });
  document.querySelectorAll("[data-map-embed]").forEach((el) => {
    el.src =
      "https://www.google.com/maps?q=" +
      encodeURIComponent(config.address) +
      "&output=embed";
  });
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (config[key])
      el.textContent = key === "instagram" ? "@" + config[key] : config[key];
  });

  document.getElementById("ano").textContent = new Date().getFullYear();

  /* ---------- Header ganha fundo ao sair do topo (sem listener de scroll) ---------- */
  const header = document.querySelector(".header");
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText =
    "position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", !entry.isIntersecting);
  }).observe(sentinel);

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("menu");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () =>
    setMenu(toggle.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Destaca o link da seção visível ---------- */
  const links = [...nav.querySelectorAll("a:not(.btn)")];
  const sections = links
    .map((a) => document.querySelector(a.hash))
    .filter(Boolean);

  {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle("is-active", a.hash === "#" + entry.target.id),
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => spy.observe(s));

    /* ---------- Animação de entrada ---------- */
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      // Escalonamento curto entre irmãos (ex.: itens do Dojo Kun entram em sequência)
      const index = [...el.parentElement.children].indexOf(el);
      el.style.transitionDelay = (index % 5) * 70 + "ms";
      reveal.observe(el);
    });
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  const form = document.getElementById("form-contato");
  const error = document.getElementById("nome-erro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();

    if (!nome) {
      error.hidden = false;
      form.nome.setAttribute("aria-invalid", "true");
      form.nome.focus();
      return;
    }
    error.hidden = true;
    form.nome.removeAttribute("aria-invalid");

    const msg = form.mensagem.value.trim();
    const text =
      "Olá! Meu nome é " +
      nome +
      ".\n\n" +
      (msg || "Gostaria de agendar uma aula experimental na Shurikan.");

    window.open(whatsappUrl(text), "_blank", "noopener");
  });
})();
