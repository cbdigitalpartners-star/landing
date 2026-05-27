// C&B Digital Partners — progressive enhancement (delight only, no core deps)

// Theme toggle — flips light/dark, persists choice, defaults to system.
(function () {
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var root = document.documentElement;

  function resolved() {
    if (root.classList.contains("theme-dark")) return "dark";
    if (root.classList.contains("theme-light")) return "light";
    return (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function sync() { btn.setAttribute("aria-pressed", String(resolved() === "dark")); }
  sync();

  function apply(next) {
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add("theme-" + next);
    try { localStorage.setItem("cb-theme", next); } catch (e) { /* storage blocked */ }
    sync();
  }

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  btn.addEventListener("click", function () {
    var next = resolved() === "dark" ? "light" : "dark";

    // Plain swap when View Transitions unsupported or motion not welcome.
    if (!document.startViewTransition || reduce) { apply(next); return; }

    // Circle reveal radiating from the toggle button.
    var r = btn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    var vt = document.startViewTransition(function () { apply(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)",
                     "circle(" + end + "px at " + x + "px " + y + "px)"] },
        { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)" }
      );
    });
  });
})();

(function () {
  "use strict";

  // Console note for the curious (technical audience inspects source).
  try {
    console.log(
      "%cC&B Digital Partners%c\n¿Inspeccionando el código? Nos gusta tu estilo.\nConstruimos software a medida. Hablemos → contacto@cbdigitalpartners.cl",
      "font:600 18px 'Space Grotesk',system-ui,sans-serif;color:#4f6bff",
      "font:13px ui-monospace,monospace;color:#6b7280"
    );
  } catch (e) { /* console unavailable — ignore */ }

  // Scroll reveal — enhancement only. Skip entirely when motion isn't welcome
  // or IntersectionObserver is unavailable, so content is always visible by default.
  var motionOK = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (!motionOK || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("reveal-on");

  var targets = document.querySelectorAll(
    ".section-head, .feature, .sol-feature, .sol-grid > *, .trust-item, .cta-band"
  );
  targets.forEach(function (el) { el.classList.add("reveal"); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  targets.forEach(function (el) { io.observe(el); });
})();

// Hero circuit: subtle parallax tilt toward the cursor (fine pointers only).
(function () {
  var deco = document.querySelector(".hero-deco");
  var hero = document.querySelector(".hero");
  if (!deco || !hero) return;

  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  var motionOK = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (!fine || !motionOK) return;

  var MAX_X = 16, MAX_Y = 11, MAX_R = 2.6;
  var tx = 0, ty = 0, rot = 0, txT = 0, tyT = 0, rotT = 0, raf = null;

  function loop() {
    tx += (txT - tx) * 0.08;
    ty += (tyT - ty) * 0.08;
    rot += (rotT - rot) * 0.08;
    deco.style.setProperty("--tx", tx.toFixed(2) + "px");
    deco.style.setProperty("--ty", ty.toFixed(2) + "px");
    deco.style.setProperty("--rot", rot.toFixed(3) + "deg");
    if (Math.abs(txT - tx) > 0.1 || Math.abs(tyT - ty) > 0.1 || Math.abs(rotT - rot) > 0.01) {
      raf = requestAnimationFrame(loop);
    } else { raf = null; }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5;
    var ny = (e.clientY - r.top) / r.height - 0.5;
    txT = nx * MAX_X; tyT = ny * MAX_Y; rotT = nx * MAX_R;
    kick();
  });
  hero.addEventListener("pointerleave", function () { txT = tyT = rotT = 0; kick(); });
})();

// Scrollspy: light the nav link of the section in view. IntersectionObserver,
// not scroll events — event-driven, no per-frame work.
(function () {
  if (!("IntersectionObserver" in window)) return;

  var links = {};
  document.querySelectorAll(".nav-links a[href^='#']").forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var sections = [].slice.call(document.querySelectorAll("section[id]"))
    .filter(function (s) { return links[s.id]; });
  if (!sections.length) return;

  function setActive(id) {
    for (var key in links) links[key].classList.toggle("is-active", key === id);
  }

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(function (s) { spy.observe(s); });
})();

// Gastus mock — 3D tilt toward cursor (fine pointer + motion only).
(function () {
  var media = document.querySelector(".sol-feature-media");
  var mock = document.querySelector(".gastus-mock");
  if (!media || !mock) return;
  if (!(window.matchMedia && matchMedia("(pointer: fine)").matches &&
        matchMedia("(prefers-reduced-motion: no-preference)").matches)) return;

  var rx = 0, ry = 0, rxT = 0, ryT = 0, raf = null;
  function loop() {
    rx += (rxT - rx) * 0.12; ry += (ryT - ry) * 0.12;
    mock.style.setProperty("--rx", rx.toFixed(2) + "deg");
    mock.style.setProperty("--ry", ry.toFixed(2) + "deg");
    if (Math.abs(rxT - rx) > 0.05 || Math.abs(ryT - ry) > 0.05) raf = requestAnimationFrame(loop);
    else raf = null;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  media.addEventListener("pointermove", function (e) {
    var r = media.getBoundingClientRect();
    ryT = ((e.clientX - r.left) / r.width - 0.5) * 10;
    rxT = -((e.clientY - r.top) / r.height - 0.5) * 10;
    kick();
  });
  media.addEventListener("pointerleave", function () { rxT = ryT = 0; kick(); });
})();

// Gastus balance — count up when scrolled into view (motion only).
(function () {
  var el = document.querySelector(".gm-balance");
  if (!el || !("IntersectionObserver" in window)) return;
  if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: no-preference)").matches)) return;

  var target = parseInt(el.getAttribute("data-value"), 10) || 0;
  function fmt(n) { return "$" + Math.round(n).toLocaleString("es-CL"); }
  var done = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || done) return;
      done = true; io.disconnect();
      var start = null, dur = 1100;
      el.textContent = fmt(0);
      requestAnimationFrame(function step(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.4 });
  io.observe(el);
})();

// CTA email button — magnetic pull toward cursor within the band.
(function () {
  var band = document.querySelector(".cta-band");
  var btn = band && band.querySelector(".magnetic");
  if (!band || !btn) return;
  if (!(window.matchMedia && matchMedia("(pointer: fine)").matches &&
        matchMedia("(prefers-reduced-motion: no-preference)").matches)) return;

  var mx = 0, my = 0, mxT = 0, myT = 0, raf = null, MAX = 10;
  function loop() {
    mx += (mxT - mx) * 0.15; my += (myT - my) * 0.15;
    btn.style.setProperty("--mx", mx.toFixed(2) + "px");
    btn.style.setProperty("--my", my.toFixed(2) + "px");
    if (Math.abs(mxT - mx) > 0.1 || Math.abs(myT - my) > 0.1) raf = requestAnimationFrame(loop);
    else raf = null;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  band.addEventListener("pointermove", function (e) {
    var r = btn.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2);
    var dy = e.clientY - (r.top + r.height / 2);
    var pull = Math.max(0, 1 - Math.hypot(dx, dy) / 260);
    mxT = Math.max(-MAX, Math.min(MAX, dx * 0.2 * pull));
    myT = Math.max(-MAX, Math.min(MAX, dy * 0.2 * pull));
    kick();
  });
  band.addEventListener("pointerleave", function () { mxT = myT = 0; kick(); });
})();
