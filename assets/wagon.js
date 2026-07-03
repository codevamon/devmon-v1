(function () {
  "use strict";

  // --------------------------------------------------
  // Estado global
  // --------------------------------------------------
  const WAGON = {
    initialized: false,
    lenis: null,
    rafId: null,
    splideInstances: [],
    resizeTimeout: null
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function debounce(callback, delay = 150) {
    return function (...args) {
      clearTimeout(WAGON.resizeTimeout);
      WAGON.resizeTimeout = setTimeout(() => callback.apply(this, args), delay);
    };
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function safeRefreshScrollTrigger() {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }

  // --------------------------------------------------
  // GSAP + ScrollTrigger
  // --------------------------------------------------
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("[wagon] GSAP o ScrollTrigger no están disponibles.");
      return;
    }
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // --------------------------------------------------
  // Lenis — un solo RAF vía gsap.ticker
  // --------------------------------------------------
  function destroyLenis() {
    if (WAGON.lenis && typeof WAGON.lenis.destroy === "function") {
      WAGON.lenis.destroy();
    }
    WAGON.lenis = null;
  }

  function initLenis() {
    if (!window.Lenis) {
      console.warn("[wagon] Lenis no está disponible.");
      return;
    }

    // Touch: scroll nativo puro, sin ninguna intervención
    if (IS_TOUCH) return;

    destroyLenis();

    WAGON.lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      infinite: false
    });

    WAGON.lenis.on("scroll", function () {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.update();
      }
    });

    if (window.gsap) {
      window.gsap.ticker.add(function (time) {
        if (WAGON.lenis) {
          WAGON.lenis.raf(time * 1000);
        }
      });
      window.gsap.ticker.lagSmoothing(0);
    }

    if (window.ScrollTrigger) {
      window.ScrollTrigger.addEventListener("refresh", function () {
        if (WAGON.lenis) {
          WAGON.lenis.resize();
        }
      });
    }
  }

  // --------------------------------------------------
  // Splitting
  // HTML: <h2 data-splitting>Texto</h2>
  //       <h2 data-splitting="words">Texto</h2>
  //       <h2 data-splitting="chars">Texto</h2>
  // --------------------------------------------------
  function initSplitting(scope = document) {
    if (!window.Splitting) {
      console.warn("[wagon] Splitting no está disponible.");
      return;
    }

    const targets = qsa("[data-splitting]", scope).filter(function (el) {
      return !el.dataset.wagonSplitInitialized;
    });

    if (!targets.length) return;

    window.Splitting({ target: targets });

    targets.forEach(function (el) {
      el.dataset.wagonSplitInitialized = "true";
    });
  }

  // --------------------------------------------------
  // Splide
  // --------------------------------------------------
  function destroySplides() {
    if (!WAGON.splideInstances.length) return;
    WAGON.splideInstances.forEach(function (instance) {
      try { instance.destroy(true); } catch (e) {
        console.warn("[wagon] Error destruyendo Splide:", e);
      }
    });
    WAGON.splideInstances = [];
  }

  function parseBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return value === "true";
  }

  function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  function buildSplideOptions(el) {
    const destroyAt = el.dataset.splideDestroy || "";
    const options = {
      type:          el.dataset.splideType || "slide",
      perPage:       parseNumber(el.dataset.splidePerPage, 1),
      perMove:       parseNumber(el.dataset.splidePerMove, 1),
      gap:           el.dataset.splideGap || "0px",
      autoplay:      parseBoolean(el.dataset.splideAutoplay, false),
      arrows:        parseBoolean(el.dataset.splideArrows, true),
      pagination:    parseBoolean(el.dataset.splidePagination, true),
      rewind:        parseBoolean(el.dataset.splideRewind, false),
      drag:          parseBoolean(el.dataset.splideDrag, true),
      pauseOnHover:  parseBoolean(el.dataset.splidePauseOnHover, true),
      pauseOnFocus:  parseBoolean(el.dataset.splidePauseOnFocus, true),
      interval:      parseNumber(el.dataset.splideInterval, 5000),
      speed:         parseNumber(el.dataset.splideSpeed, 800),
      padding:       el.dataset.splidePadding || "0px"
    };

    if (destroyAt === "mobile")  options.breakpoints = { 767: { destroy: true } };
    if (destroyAt === "desktop") options.breakpoints = { 768: { destroy: true } };

    return options;
  }

  function initSplide(scope = document) {
    if (!window.Splide) {
      console.warn("[wagon] Splide no está disponible.");
      return;
    }

    const sliders = qsa("[data-splide]", scope).filter(function (el) {
      return !el.dataset.wagonSplideInitialized;
    });

    if (!sliders.length) return;

    sliders.forEach(function (el) {
      try {
        const instance = new window.Splide(el, buildSplideOptions(el));
        instance.mount();
        el.dataset.wagonSplideInitialized = "true";
        WAGON.splideInstances.push(instance);
      } catch (e) {
        console.warn("[wagon] Error inicializando Splide:", e, el);
      }
    });

    safeRefreshScrollTrigger();
  }

  // --------------------------------------------------
  // Animaciones — todas conviven sin pisarse
  // --------------------------------------------------

  var IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // Helper — en mobile usa IntersectionObserver, en desktop ScrollTrigger
  function animateOnEnter(el, animateFn) {
    if (IS_TOUCH) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateFn(el);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    } else {
      animateFn(el);
    }
  }

  // [data-reveal] → fade-up genérico (API original)
  function initRevealAnimations(scope = document) {
    if (!window.gsap) return;

    qsa("[data-reveal]", scope)
      .filter(el => !el.dataset.wagonRevealInitialized)
      .forEach(function (el) {
        el.dataset.wagonRevealInitialized = "true";

        animateOnEnter(el, function (target) {
          window.gsap.fromTo(target,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0,
              duration: 1, ease: "power3.out",
              scrollTrigger: IS_TOUCH ? undefined : { trigger: target, start: "top 85%", once: true }
            }
          );
        });
      });
  }

  // [data-splitting][data-split-animate] → chars o words (API original)
  function initSplitTextAnimations(scope = document) {
    if (!window.gsap) return;

    qsa("[data-splitting][data-split-animate]", scope)
      .filter(el => !el.dataset.wagonSplitAnimated)
      .forEach(function (el) {
        const chars = qsa(".char", el);
        const words = qsa(".word", el);
        const targets = chars.length ? chars : words;
        if (!targets.length) return;

        el.dataset.wagonSplitAnimated = "true";

        animateOnEnter(el, function () {
          window.gsap.fromTo(targets,
            { opacity: 0, yPercent: 60 },
            {
              opacity: 1, yPercent: 0,
              duration: 0.8, stagger: 0.03, ease: "power3.out",
              scrollTrigger: IS_TOUCH ? undefined : { trigger: el, start: "top 85%", once: true }
            }
          );
        });
      });
  }

  // [data-anim="chars"] → entrada por caracteres con rotación
  function initCharsAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="chars"]', scope)
      .filter(el => !el.dataset.wagonCharsAnimated)
      .forEach(function (el) {
        const chars = qsa(".char", el);
        if (!chars.length) return;

        el.dataset.wagonCharsAnimated = "true";

        animateOnEnter(el, function () {
          window.gsap.from(chars, {
            opacity: 0, y: 60, rotateX: -90,
            stagger: 0.03, duration: 0.4, ease: "back.out(1.2)",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: el, start: "top 85%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="words"] → entrada por palabras
  function initWordsAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="words"]', scope)
      .filter(el => !el.dataset.wagonWordsAnimated)
      .forEach(function (el) {
        const words = qsa(".word", el);
        if (!words.length) return;

        el.dataset.wagonWordsAnimated = "true";

        animateOnEnter(el, function () {
          window.gsap.from(words, {
            opacity: 0, y: 20,
            stagger: 0.08, duration: 0.27, ease: "back.out(1.2)",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: el, start: "top 85%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="fade-up"] → fade-up simple sin Splitting
  function initFadeUpAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="fade-up"]', scope)
      .filter(el => !el.dataset.wagonFadeUpAnimated)
      .forEach(function (el) {
        el.dataset.wagonFadeUpAnimated = "true";

        animateOnEnter(el, function (target) {
          window.gsap.from(target, {
            opacity: 0, y: 50,
            duration: 0.9, ease: "power2.out",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target, start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="stagger"] → hijos del contenedor con stagger
  function initStaggerAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="stagger"]', scope)
      .filter(el => !el.dataset.wagonStaggerAnimated)
      .forEach(function (container) {
        if (!container.children.length) return;

        container.dataset.wagonStaggerAnimated = "true";

        animateOnEnter(container, function (target) {
          window.gsap.from(Array.from(target.children), {
            opacity: 0, y: 40,
            stagger: 0.12, duration: 0.7, ease: "power2.out",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target, start: "top 85%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-parallax="0.3"] → parallax scrub (0.1 sutil → 0.5 fuerte)

  function initParallaxAnimations(scope = document) {
    if (IS_TOUCH) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    qsa("[data-parallax]", scope)
      .filter(el => !el.dataset.wagonParallaxInitialized)
      .forEach(function (el) {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.dataset.wagonParallaxInitialized = "true";
        window.gsap.to(el, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
  }


  // --------------------------------------------------
  // Hero entrance — CSS-driven, zero GSAP overhead
  // --------------------------------------------------
  function initSuperheroEntrance() {
    const hero = document.querySelector('.superhero-i');
    if (!hero) return;

    // window.load garantiza que imágenes y fuentes están listos
    // Doble rAF = el browser ya pintó al menos un frame
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hero.classList.add('hero-ready');
        });
      });
    }, { once: true });
  }


  function initPageEntrance() {
    const body = document.body;
    const header = document.querySelector('.header__row--top');
    const hero = document.querySelector('.superhero-i');

    if (!body) return;

    const reveal = function () {
      body.classList.add('wagon-page-ready');

      if (header) {
        header.classList.add('header-ready');
      }

      if (hero) {
        hero.classList.add('hero-ready');
      }
    };

    if (
      body.classList.contains('wagon-page-ready') &&
      (!header || header.classList.contains('header-ready')) &&
      (!hero || hero.classList.contains('hero-ready'))
    ) {
      return;
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(function () {
          setTimeout(function () {
            requestAnimationFrame(function () {
              requestAnimationFrame(reveal);
            });
          }, 120);
        })
        .catch(reveal);
    } else {
      window.addEventListener('load', reveal, { once: true });
    }

    setTimeout(reveal, 2400);
  }


  // --------------------------------------------------
  // Header entrance — CSS-driven, mismo patrón que el hero
  // --------------------------------------------------
  function initHeaderEntrance() {
    const header = document.querySelector('.header__row--top');
    if (!header || header.classList.contains('header-ready')) return;

    requestAnimationFrame(function () {
      header.classList.add('header-ready');
    });
  }


  // [data-anim="title-mask"] → palabras con máscara y chars emergiendo
  function initTitleMaskAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="title-mask"]', scope)
      .filter(el => !el.dataset.wagonTitleMaskAnimated)
      .forEach(function (el) {
        const chars = qsa(".char", el);
        if (!chars.length) return;

        el.dataset.wagonTitleMaskAnimated = "true";

        animateOnEnter(el, function () {
          window.gsap.from(chars, {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            stagger: 0.014,
            ease: "expo.out",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="decor-float"] → hijos con scale + rotation + stagger relajado
  function initDecorFloatAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="decor-float"]', scope)
      .filter(el => !el.dataset.wagonDecorFloatAnimated)
      .forEach(function (container) {
        const items = Array.from(container.children);
        if (!items.length) return;

        container.dataset.wagonDecorFloatAnimated = "true";

        animateOnEnter(container, function (target) {
          window.gsap.from(items, {
            opacity: 0,
            scale: 0.55,
            rotation: function (i) {
              // rotaciones alternadas por índice — sensación orgánica
              return (i % 2 === 0 ? -1 : 1) * (8 + (i * 2));
            },
            y: 25,
            duration: 1.2,
            stagger: { each: 0.09, from: "random" },
            ease: "back.out(1.4)",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="title-reveal"] → clip-path mask + translate del inner
  // No muta el DOM. Funciona con cualquier HTML interno (<strong>, <em>, etc.)
  function initTitleRevealAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="title-reveal"]', scope)
      .filter(el => !el.dataset.wagonTitleRevealAnimated)
      .forEach(function (el) {
        const inner = el.firstElementChild;
        if (!inner) return;

        el.dataset.wagonTitleRevealAnimated = "true";

        // Estilos críticos vía JS — sin depender de CSS externo
        el.style.display = el.style.display || 'block';
        inner.style.willChange = 'transform';

        animateOnEnter(el, function (target) {
          // Timeline para sincronizar clip-path del wrapper + yPercent del inner
          const tl = window.gsap.timeline({
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          });

          tl.fromTo(target,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "expo.out" },
            0
          );

          tl.fromTo(inner,
            { yPercent: 60 },
            { yPercent: 0, duration: 1.3, ease: "expo.out" },
            0
          );
        });
      });
  }

  // [data-anim="decor-pop"] → entrada de las imágenes internas (hijo > img)
  // Pensada para parejarse con [data-parallax] en el figure padre.
  // El figure se ocupa del parallax, el img de la entrada — sin conflicto de transforms.
  function initDecorPopAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="decor-pop"]', scope)
      .filter(el => !el.dataset.wagonDecorPopAnimated)
      .forEach(function (container) {
        const items = qsa(':scope > * > img', container);
        if (!items.length) return;

        container.dataset.wagonDecorPopAnimated = "true";

        animateOnEnter(container, function (target) {
          window.gsap.from(items, {
            opacity: 0,
            scale: 0.4,
            rotation: function (i) {
              // Rotaciones alternadas y crecientes — sensación orgánica
              return (i % 2 === 0 ? -1 : 1) * (12 + (i * 3));
            },
            duration: 1.3,
            stagger: { each: 0.1, from: "random" },
            ease: "back.out(1.6)",
            transformOrigin: "center center",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }

  // [data-anim="fade-in"] → solo opacity, sin translate
  // Útil cuando el elemento tiene un hijo con su propia animación de transform
  // (parallax, scale, etc.) y querés evitar conflictos
  function initFadeInAnimations(scope = document) {
    if (!window.gsap) return;

    qsa('[data-anim="fade-in"]', scope)
      .filter(el => !el.dataset.wagonFadeInAnimated)
      .forEach(function (el) {
        el.dataset.wagonFadeInAnimated = "true";

        animateOnEnter(el, function (target) {
          window.gsap.from(target, {
            opacity: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: IS_TOUCH ? undefined : {
              trigger: target,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        });
      });
  }






  // --------------------------------------------------
  // Scope init — orden importa: Splitting primero
  // --------------------------------------------------
  function initScope(scope = document) {
    initSplitting(scope);
    initSplide(scope);
    initRevealAnimations(scope);
    initSplitTextAnimations(scope);
    initTitleMaskAnimations(scope);   
    initTitleRevealAnimations(scope);  
    initCharsAnimations(scope);
    initWordsAnimations(scope);
    initFadeUpAnimations(scope);
    initFadeInAnimations(scope);
    initStaggerAnimations(scope);
    initDecorFloatAnimations(scope);
    initDecorPopAnimations(scope);
    initParallaxAnimations(scope);
    safeRefreshScrollTrigger();
  }

  function destroyBeforeReinit() {
    destroySplides();
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }

  function initAll() {
    initGSAP();
    initLenis();
    initScope(document);
    initPageEntrance();
    WAGON.initialized = true;
  }

  function reinitAll() {
    destroyBeforeReinit();
    initScope(document);
    safeRefreshScrollTrigger();
  }

  // --------------------------------------------------
  // Shopify Theme Editor
  // --------------------------------------------------
  function bindShopifyEditorEvents() {
    document.addEventListener("shopify:section:load",    e => initScope(e.target));
    document.addEventListener("shopify:section:reorder", () => reinitAll());
    document.addEventListener("shopify:section:select",  e => { initScope(e.target); safeRefreshScrollTrigger(); });
    document.addEventListener("shopify:block:select",    () => safeRefreshScrollTrigger());
  }

  // --------------------------------------------------
  // Resize
  // --------------------------------------------------
  function bindResize() {
    window.addEventListener("resize", debounce(function () {
      if (WAGON.lenis && typeof WAGON.lenis.resize === "function") {
        WAGON.lenis.resize();
      }
      safeRefreshScrollTrigger();
    }, 200));
  }

  // --------------------------------------------------
  // API pública
  // --------------------------------------------------
  window.WagonTheme = {
    init: initAll,
    reinit: reinitAll,
    refresh: safeRefreshScrollTrigger,
    getLenis: function () { return WAGON.lenis; }
  };

  // --------------------------------------------------
  // Boot
  // --------------------------------------------------
  onReady(function () {
    initAll();
    bindShopifyEditorEvents();
    bindResize();
  });

})();



(function () {
  function initScopedFormSuccess() {
    const forms = document.querySelectorAll('form[action*="/contact"]');

    forms.forEach((form) => {
      if (form.dataset.successBound === 'true') return;
      form.dataset.successBound = 'true';

      form.addEventListener('submit', function () {
        const input = form.querySelector('input[name="contact[form_success_id]"]');
        if (!input || !input.value) return;

        sessionStorage.setItem('lastSubmittedContactForm', input.value);
      });
    });

    const submittedFormId = sessionStorage.getItem('lastSubmittedContactForm');
    if (!submittedFormId) return;

    const wrappers = document.querySelectorAll('[data-form-success-wrapper]');

    wrappers.forEach((wrapper) => {
      const wrapperId = wrapper.dataset.formSuccessId;
      const wasPosted = wrapper.dataset.formPosted === 'true';

      const button = wrapper.querySelector('[data-form-submit-button]');
      const message = wrapper.querySelector('[data-form-success-message]');

      if (!button || !message) return;

      if (wasPosted && wrapperId === submittedFormId) {
        button.hidden = true;
        message.hidden = false;
        sessionStorage.removeItem('lastSubmittedContactForm');
      } else {
        button.hidden = false;
        message.hidden = true;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScopedFormSuccess);
  } else {
    initScopedFormSuccess();
  }

  document.addEventListener('shopify:section:load', initScopedFormSuccess);
})();