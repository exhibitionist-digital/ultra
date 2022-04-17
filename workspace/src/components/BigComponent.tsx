import React, { ReactNode } from "react";

export default function BigComponent({ children }: { children?: ReactNode }) {
  return (
    <h3>
      This is a lazily loaded component
      {children}
    </h3>
  );
}
