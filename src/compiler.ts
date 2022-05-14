import {
  cache,
  initSwc,
  parseSync,
  printSync,
  toFileUrl,
  transformSync,
  Visitor,
} from "./deps.ts";
import type { ParseOptions, Program } from "./deps.ts";
import type { CompileOptions, CompilerOptions, Mode } from "./types.ts";

export class Compiler {
  #mode: Mode;
  #initialised = false;

  readonly parserOptions: ParseOptions;
  readonly modules: Set<URL>;
  readonly scripts: Set<URL>;
  readonly visitors: Set<Visitor>;

  constructor(options: CompilerOptions) {
    const {
      mode,
      parserOptions = {
        syntax: "typescript",
        tsx: true,
        dynamicImport: true,
        target: "es2021",
      },
    } = options;

    this.#mode = mode;
    this.parserOptions = parserOptions;
    this.modules = new Set();
    this.scripts = new Set();
    this.visitors = new Set();
  }

  async init(url: string | URL) {
    if (!this.#initialised) {
      const wasm = await cache(url);
      await initSwc(toFileUrl(wasm.path));
    }

    this.#initialised = true;
  }

  get isDevelopment() {
    return this.#mode === "development";
  }

  addVisitor(visitor: Visitor): Compiler {
    this.visitors.add(visitor);
    return this;
  }

  compile({ input, url }: CompileOptions) {
    const transformed = this.#transform(input, url);
    const ast = this.#parse(transformed);
    const transformedAst = this.#visit(ast);

    if (transformedAst.type === "Module") {
      this.modules.add(url);
    } else if (transformedAst.type === "Script") {
      this.scripts.add(url);
    }

    return this.#print(transformedAst);
  }

  #transform(input: string, url: URL): string {
    const transformOptions = this.#getTransformOptions(this.isDevelopment);
    const transformed = transformSync(input, {
      filename: url.pathname,
      ...transformOptions,
    });

    return transformed.code;
  }

  #parse(input: string): Program {
    return parseSync(input, this.parserOptions) as Program;
  }

  #visit(program: Program): Program {
    for (const visitor of this.visitors) {
      program = visitor.visitProgram(program);
    }

    return program;
  }

  #print(ast: Program): string {
    const { code } = printSync(ast, {
      minify: !this.isDevelopment,
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          ecma: 2016,
        },
      },
    });

    return code;
  }

  #getTransformOptions(isDevelopment: boolean) {
    return {
      sourceMaps: false,
      jsc: {
        parser: this.parserOptions,
        transform: {
          react: {
            development: isDevelopment,
            runtime: "automatic",
          },
        },
        target: "es2021",
      },
    };
  }
}
