import { PropsWithChildren } from "react";

export function HotTip({ children }: PropsWithChildren) {
  return (
    <div className="hot-tip">
      <strong className="hot-tip-title">Hot tip!</strong>
      {children}
    </div>
  );
}
