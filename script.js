(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- reading progress ---- */
  var bar = document.getElementById("progress");
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + "%";
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("menuToggle");
  var links = document.getElementById("navlinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          // let the collapsed layout settle before scrolling, so
          // scroll-margin-top lands the heading just below the bar
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
              target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
              });
              if (history.replaceState) history.replaceState(null, "", id);
            });
          });
          return;
        }
      }
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- fade-in on scroll ---- */
  var targets = document.querySelectorAll("section, .masthead");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  targets.forEach(function (el) { el.classList.add("fade"); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  targets.forEach(function (el) { io.observe(el); });
})();
