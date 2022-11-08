import { ReactNode } from "react";

export function ModuleSource(
  { filename, children }: { filename: string; children: ReactNode },
) {
  return (
    <div className="module">
      <div className="module-filename">{filename}.tsx</div>
      <div className="module-source">{children}</div>
    </div>
  );
}
