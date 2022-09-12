export function hydrateIslands() {
  const data = Object.fromEntries(globalThis.__ULTRA_ISLAND_DATA);
  const components = Object.fromEntries(globalThis.__ULTRA_ISLAND_COMPONENT);
  const baseUrl = globalThis.__ULTRA_ISLAND_URL;

  const markers = Array.from(
    document.querySelectorAll("template[data-hydration-marker]"),
  );

  function filterMarkers(strategy) {
    return markers.filter((m) => m.dataset.hydrationStrategy === strategy);
  }

  const visible = filterMarkers("visible");
  const idle = filterMarkers("idle");
  const load = filterMarkers("load");

  async function hydrateIsland(id, container) {
    const { createElement: h, lazy } = await import("react");
    const { createRoot } = await import("react-dom/client");
    const { props, name } = data[id];

    const url = new URL(
      components[name],
      new URL(baseUrl, window.location.href),
    );

    const root = createRoot(container);
    root.render(h(lazy(() => import(url)), props));
  }

  if (visible.length) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const m = entry.target.previousElementSibling;
          const id = m.dataset.hydrationMarker;
          await hydrateIsland(id, entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    visible.map((marker) => observer.observe(marker.nextElementSibling));
  }

  if (idle.length) {
    requestIdleCallback(() => {
      idle.map(async (m) => {
        const id = m.dataset.hydrationMarker;
        await hydrateIsland(id, m.nextElementSibling);
      });
    });
  }

  if (load.length) {
    load.map(async (m) => {
      const id = m.dataset.hydrationMarker;
      await hydrateIsland(id, m.nextElementSibling);
    });
  }
}
