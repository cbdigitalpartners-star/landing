// C&B Digital Partners — progressive enhancement (delight only, no core deps)
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
