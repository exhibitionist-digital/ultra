import React, { type ReactNode } from "react";
import { create, type Sheet, ThemeConfiguration, type TW } from "twind";

const TWContext = React.createContext<TW | null>(null);

type TWProviderProps = {
  sheet: Sheet;
  theme?: ThemeConfiguration;
  children?: ReactNode;
};

export function TWProvider({ sheet, theme, children }: TWProviderProps) {
  const { tw } = create({ sheet, theme });
  return <TWContext.Provider value={tw}>{children}</TWContext.Provider>;
}

export function useTwContext() {
  const context = React.useContext(TWContext);
  if (!context) {
    throw new Error("No TWProvider found");
  }
  return context;
}

export const serverSheet = (target = new Set<string>()) => {
  return {
    target,
    insert: (rule: string) => {
      target.add(rule);
    },
  };
};
