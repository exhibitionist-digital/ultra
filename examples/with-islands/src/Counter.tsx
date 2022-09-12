import { useEffect, useRef, useState } from "react";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHydrated(true);
    }
  }, []);

  return (
    <div ref={ref}>
      {hydrated && <p style={{ color: "red" }}>Hydrated</p>}
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>
        -1
      </button>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}

/**
 * This is key to make a component island compatible
 */
Counter.url = import.meta.url;
