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

function toString(string: string | URL): string {
  return typeof string === "string" ? string : string.toString();
}

export class LinkHeader extends Map<string, Link> {
  preloadModule(href: string | URL) {
    this.set(toString(href), {
      rel: "modulepreload",
    });
  }

  preloadScript(href: string | URL) {
    this.set(toString(href), {
      rel: "preload",
      as: "script",
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
