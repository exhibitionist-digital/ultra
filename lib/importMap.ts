export type ImportMap = {
  imports?: SpecifierMap;
  scopes?: Record<string, SpecifierMap>;
};

type SpecifierMap = Record<string, string>;
