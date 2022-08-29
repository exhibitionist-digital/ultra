import useFlushEffects from "ultra/hooks/use-flush-effects.js";

interface StitchesProviderProps {
  children: React.ReactNode;
  cssText: () => string;
}

export function StitchesProvider({ children, cssText }: StitchesProviderProps) {
  /**
   * useFlushEffects will inject the returned output into the rendered stream.
   */
  useFlushEffects(() => {
    return (
      <style
        id="stitches"
        dangerouslySetInnerHTML={{ __html: cssText() }}
      >
      </style>
    );
  });

  return <>{children}</>;
}
