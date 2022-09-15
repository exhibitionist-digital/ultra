import { useCallback, useEffect, useRef } from "react";

/**
 * @returns {() => boolean}
 */
export default function useMountedState() {
  const mountedRef = useRef(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
