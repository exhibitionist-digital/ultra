const invalidated = "__$$invalidated$$__";

export class SourcesMap extends Map {
  // deno-lint-ignore no-explicit-any
  constructor(private loadSource: (key: string) => Promise<any>) {
    super();
  }

  // deno-lint-ignore no-explicit-any
  async get(key: string): Promise<any> {
    let value = super.get(key);

    if (value === invalidated) {
      console.log(`Source load: ${key}`);
      value = await this.loadSource(key);
      this.set(key, value);
    }

    return value;
  }

  invalidate(key: string) {
    if (this.has(key)) {
      console.log(`Source invalidated: ${key}`);
      this.set(key, invalidated);
    }

    return this;
  }
}
