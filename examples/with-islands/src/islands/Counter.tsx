import { useEffect, useRef, useState } from "react";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("hydrated");
    }
  }, []);

  return (
    <div ref={ref}>
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

Counter.url = import.meta.url;
