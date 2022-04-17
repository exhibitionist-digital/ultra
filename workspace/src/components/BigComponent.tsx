import React, { ReactNode } from "react";

export default function BigComponent({ children }: { children?: ReactNode }) {
  return (
    <div>
      This is a lazily loaded component
      {children}
    </div>
  );
}
