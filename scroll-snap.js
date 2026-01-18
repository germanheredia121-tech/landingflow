// TikTok / Reels style scroll snap
(function () {
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;

  // 🚫 En mobile no hacemos NADA
  if (isMobile) return;

  // ==============================
  // DESKTOP SNAP
  // ==============================
  let isScrolling = false;
  let scrollTimeout = null;
  let wheelTimeout = null;

  function isInsideScrollableSection() {
    return document.querySelector('section[data-allow-scroll]:hover');
  }

  function snapToNearestSection() {
    if (isScrolling) return;
    if (isInsideScrollableSection()) return;

    const sections = document.querySelectorAll('.snap-section');
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    let nearest = null;
    let minDistance = Infinity;

    sections.forEach((section) => {
      if (section.hasAttribute('data-allow-scroll')) return;

      const rect = section.getBoundingClientRect();
      const top = rect.top + scrollPosition;
      const distance = Math.abs(scrollPosition - top);

      if (distance < minDistance && distance < viewportHeight * 0.6) {
        minDistance = distance;
        nearest = section;
      }
    });

    if (!nearest || minDistance < 10) return;

    isScrolling = true;
    window.scrollTo({
      top: nearest.offsetTop,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrolling = false;
    }, 600);
  }

  window.addEventListener(
    'scroll',
    () => {
      if (isInsideScrollableSection()) return;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isScrolling) snapToNearestSection();
      }, 150);
    },
    { passive: true }
  );

  window.addEventListener(
    'wheel',
    () => {
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (!isScrolling) snapToNearestSection();
      }, 200);
    },
    { passive: true }
  );
})();
