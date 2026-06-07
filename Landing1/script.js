/* ===========================
   VÖRM Studio — script.js
   =========================== */

(function () {
  "use strict";

  /* ── Custom Cursor ── */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  if (cursor && follower) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + "px";
      follower.style.top = followerY + "px";
      rafId = requestAnimationFrame(animateFollower);
    }
    animateFollower();

    /* Cursor state on interactive elements */
    const interactives = document.querySelectorAll("a, button, input, textarea, .portfolio-card, .service-card");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
        follower.style.width = "60px";
        follower.style.height = "60px";
        follower.style.borderColor = "rgba(200,245,74,0.6)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        follower.style.width = "36px";
        follower.style.height = "36px";
        follower.style.borderColor = "rgba(200,245,74,0.4)";
      });
    });
  }

  /* ── Navbar Scroll Behavior ── */
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = scrollY;
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ── Mobile Menu Toggle ── */
  const navBurger = document.getElementById("navBurger");
  const navMobile = document.getElementById("navMobile");

  if (navBurger && navMobile) {
    navBurger.addEventListener("click", () => {
      navBurger.classList.toggle("active");
      navMobile.classList.toggle("open");
    });

    /* Close on link click */
    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navBurger.classList.remove("active");
        navMobile.classList.remove("open");
      });
    });
  }

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Hero reveal on load ── */
  window.addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal").forEach((el) => {
      el.classList.add("visible");
    });
  });

  /* ── Parallax orbs in hero ── */
  const orbs = document.querySelectorAll(".hero-orb");

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 12;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  });

  /* ── Hero grid subtle scroll parallax ── */
  const heroGrid = document.querySelector(".hero-grid");

  if (heroGrid) {
    window.addEventListener("scroll", () => {
      const sy = window.scrollY;
      heroGrid.style.transform = `translateY(${sy * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Active nav link highlighting ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === `#${id}`) {
              link.style.color = "var(--accent)";
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Portfolio card tilt effect ── */
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  portfolioCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 4;
      const tiltY = ((x - cx) / cx) * -4;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ── Service card glow follow ── */
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--glow-x", `${x}px`);
      card.style.setProperty("--glow-y", `${y}px`);
    });
  });

  /* ── Smooth scroll for anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── CTA Form Submission ── */
  const ctaForm = document.getElementById("ctaForm");

  if (ctaForm) {
    ctaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = ctaForm.querySelector("button[type='submit']");
      const originalText = btn.textContent;

      btn.textContent = "Sending…";
      btn.style.opacity = "0.7";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "✓ Inquiry sent!";
        btn.style.opacity = "1";
        btn.style.background = "var(--accent-2)";
        ctaForm.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.disabled = false;
        }, 3500);
      }, 1200);
    });
  }

  /* ── Ticker pause on hover ── */
  const ticker = document.querySelector(".ticker");
  if (ticker) {
    ticker.addEventListener("mouseenter", () => {
      ticker.style.animationPlayState = "paused";
    });
    ticker.addEventListener("mouseleave", () => {
      ticker.style.animationPlayState = "running";
    });
  }

  /* ── Stat counter animation ── */
  const statNums = document.querySelectorAll(".stat-num");
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }
    },
    { threshold: 0.8 }
  );

  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) statsObserver.observe(statsSection);

  function animateStats() {
    statNums.forEach((el) => {
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, "");
      const target = parseFloat(raw.replace(/[^\d.]/g, ""));
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ── Scroll progress bar (optional) ── */
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--accent);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollTotal) * 100;
    progressBar.style.width = scrolled + "%";
  }, { passive: true });

})();
