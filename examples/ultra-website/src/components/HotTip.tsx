import { PropsWithChildren } from "react";

export function HotTip({ children }: PropsWithChildren) {
  return (
    <div className="hot-tip">
      <strong>Hot tip!</strong>
      <br />
      {children}
    </div>
  );
}
