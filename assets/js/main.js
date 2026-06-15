(() => {
  "use strict";

  const header = document.querySelector("[data-site-header]");
  const navbarCollapse = document.querySelector("#primaryNav");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (navbarCollapse && header) {
    navbarCollapse.addEventListener("show.bs.collapse", () => header.classList.add("nav-open"));
    navbarCollapse.addEventListener("hide.bs.collapse", () => header.classList.remove("nav-open"));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (navbarCollapse && navbarCollapse.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counterTarget || "0");
    const duration = 1400;
    const start = performance.now();
    const suffix = target === 98 ? "%" : "+";

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  document.querySelectorAll("[data-counter-target]").forEach((counter) => counterObserver.observe(counter));

  const carousel = document.querySelector("[data-testimonial-carousel]");
  const slides = carousel ? Array.from(carousel.querySelectorAll(".testimonial-card")) : [];
  const prev = document.querySelector("[data-testimonial-prev]");
  const next = document.querySelector("[data-testimonial-next]");
  let activeSlide = 0;
  let testimonialTimer;

  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });
  };

  const queueAutoplay = () => {
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(() => showSlide(activeSlide + 1), 5500);
  };

  if (slides.length) {
    prev?.addEventListener("click", () => {
      showSlide(activeSlide - 1);
      queueAutoplay();
    });

    next?.addEventListener("click", () => {
      showSlide(activeSlide + 1);
      queueAutoplay();
    });

    queueAutoplay();
  }

  const parallaxArea = document.querySelector("[data-parallax-area]");
  if (parallaxArea && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    parallaxArea.addEventListener("pointermove", (event) => {
      const rect = parallaxArea.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      parallaxArea.querySelectorAll(".collage-img").forEach((image, index) => {
        const depth = (index + 1) * 8;
        image.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    });

    parallaxArea.addEventListener("pointerleave", () => {
      parallaxArea.querySelectorAll(".collage-img").forEach((image) => {
        image.style.transform = "";
      });
    });
  }
})();
