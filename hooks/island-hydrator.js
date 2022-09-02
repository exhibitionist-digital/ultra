requestIdleCallback(function hydrate() {
  const data = Object.fromEntries(window.__ULTRA_ISLAND_DATA);
  const components = Object.fromEntries(window.__ULTRA_ISLAND_COMPONENT);
  const baseUrl = window.__ULTRA_ISLAND_URL || "/_ultra/compiler/";

  const observer = new IntersectionObserver(async (entries, observer) => {
    const { createElement: h, lazy } = await import("react");
    const { createRoot } = await import("react-dom/client");

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const marker = entry.target.previousElementSibling;
        const id = marker.dataset.id;
        const { props, name } = data[id];

        const url = new URL(
          components[name],
          new URL(baseUrl, window.location.href),
        );

        const root = createRoot(entry.target);
        root.render(h(lazy(() => import(url)), props));

        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll("script[type='application/hydration-marker']")
    .forEach((marker) => observer.observe(marker.nextElementSibling));
});
