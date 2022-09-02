const data = Object.fromEntries(globalThis.__ULTRA_ISLAND_DATA);
const components = Object.fromEntries(globalThis.__ULTRA_ISLAND_COMPONENT);
const baseUrl = globalThis.__ULTRA_ISLAND_URL;

const markers = Array.from(
  document.querySelectorAll("template[data-hydration-marker]"),
);

const hydrateVisible = markers.filter((m) =>
  m.dataset.hydrationStrategy === "visible"
);

const hydrateIdle = markers.filter((m) =>
  m.dataset.hydrationStrategy === "idle"
);

const hydrateLoad = markers.filter((m) =>
  m.dataset.hydrationStrategy === "load"
);

async function hydrateIsland(id, container, strategy) {
  const { createElement: h, lazy } = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { props, name } = data[id];

  const url = new URL(
    components[name],
    new URL(baseUrl, window.location.href),
  );

  console.log("Hydrating Island", {
    id,
    name,
    props,
    strategy,
    url: String(url),
  });

  const root = createRoot(container);
  root.render(h(lazy(() => import(url)), props));
}

if (hydrateVisible.length) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const m = entry.target.previousElementSibling;
        const id = m.dataset.hydrationMarker;
        await hydrateIsland(id, entry.target, "visible");
        observer.unobserve(entry.target);
      }
    });
  });

  hydrateVisible.map((marker) => observer.observe(marker.nextElementSibling));
}

if (hydrateIdle.length) {
  requestIdleCallback(() => {
    hydrateIdle.map(async (m) => {
      const id = m.dataset.hydrationMarker;
      await hydrateIsland(id, m.nextElementSibling, "idle");
    });
  });
}

if (hydrateLoad.length) {
  hydrateLoad.map(async (m) => {
    const id = m.dataset.hydrationMarker;
    await hydrateIsland(id, m.nextElementSibling, "load");
  });
}
