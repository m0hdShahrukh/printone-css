document.addEventListener("DOMContentLoaded", function () {
  const marquee = document.querySelector(".brand-logos-marquee");
  const track = document.querySelector("[data-brand-track]");
  if (!marquee || !track) return;
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
  marquee.addEventListener("mouseenter", function () {
    marquee.classList.add("is-paused");
  });
  marquee.addEventListener("mouseleave", function () {
    marquee.classList.remove("is-paused");
  });
  marquee.addEventListener("touchstart", function () {
    marquee.classList.add("is-paused");
  }, { passive: true });
  marquee.addEventListener("touchend", function () {
    marquee.classList.remove("is-paused");
  });
});
