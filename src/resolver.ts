import { extname } from "./deps.ts";

export const jsify = (file: string) => {
  return file.replace(extname(file), ".js");
};

export const tsify = (file: string) => {
  return file.replace(extname(file), ".ts");
};

export const jsxify = (file: string) => {
  return file.replace(extname(file), ".jsx");
};

export const tsxify = (file: string) => {
  return file.replace(extname(file), ".tsx");
};
