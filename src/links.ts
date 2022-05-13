type ModulePreload = {
  rel: "modulepreload";
};

type Preload = {
  rel: "preload";
  as: string;
};

type Link = ModulePreload | Preload;

function isModulePreloadLink(link: Link): link is ModulePreload {
  return link.rel === "modulepreload";
}

export class LinkHeader extends Map<string, Link> {
  preloadModule(href: string | URL) {
    this.set(typeof href === "string" ? href : href.toString(), {
      rel: "modulepreload",
    });
  }

  toString() {
    const links = [];

    for (const [href, link] of this.entries()) {
      if (isModulePreloadLink(link)) {
        links.push(`<${href}>; rel="${link.rel}"`);
      } else {
        links.push(`<${href}>; rel="${link.rel}"; as="${link.as}"`);
      }
    }

    return links.join(", ");
  }
}
