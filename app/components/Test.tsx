import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    throw new Error("Boom!");
  }, []);

  return <div>Test</div>;
}
