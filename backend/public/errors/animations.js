document.addEventListener("DOMContentLoaded", () => {
    // Select elements using data-attributes as per GSAP Choreography Skill
    const container = document.querySelector('[data-film-container]');
    const icon = document.querySelector('[data-film-icon]');
    const codeText = document.querySelector('[data-film-code]');
    const titleText = document.querySelector('[data-film-title]');
    const messageEl = document.querySelector('[data-film-message]');
    const caret = document.querySelector('[data-film-caret]');
    const btn = document.querySelector('[data-film-btn]');

    // Get the error message text from the data attribute
    const fullMessage = messageEl.getAttribute('data-film-message');
    // Clear initial text for typing effect
    messageEl.textContent = "";

    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Label: "reveal"
    tl.to(container, { autoAlpha: 1, y: 0, duration: 0.6 }, "reveal")
      .to(icon, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, "reveal+=0.2")
      .to(codeText, { autoAlpha: 1, duration: 0.4 }, "reveal+=0.4")
      .to(titleText, { autoAlpha: 1, y: 0, duration: 0.5 }, "reveal+=0.5");

    // Add specific icon animations based on error type
    if (document.body.classList.contains("is-423")) {
        // Shake the lock
        tl.to(icon, { rotation: 15, duration: 0.1, yoyo: true, repeat: 3 }, "reveal+=0.8");
    } else if (document.body.classList.contains("is-404")) {
        // Float the broken link
        tl.to(icon, { y: -5, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" }, "reveal+=0.8");
    } else if (document.body.classList.contains("is-500")) {
        // Flash the server error
        tl.to(icon, { opacity: 0.5, duration: 0.1, yoyo: true, repeat: 5 }, "reveal+=0.8");
    }

    // Label: "typeMessage"
    const counter = { x: 0 };
    tl.to(caret, { autoAlpha: 1, duration: 0.1 }, "typeMessage")
      .to(counter, {
          x: fullMessage.length,
          duration: Math.max(fullMessage.length * 0.04, 0.5), // dynamic typing duration
          ease: "none", // constant speed for typewriter effect
          onUpdate: () => {
              messageEl.textContent = fullMessage.slice(0, Math.round(counter.x));
          }
      }, "typeMessage+=0.1")
      .to(caret, { autoAlpha: 0, duration: 0.1, repeat: 4, yoyo: true }, "typeMessage+=1.5");

    // Label: "showBtn"
    tl.to(btn, { autoAlpha: 1, y: 0, duration: 0.5 }, "showBtn");
});
