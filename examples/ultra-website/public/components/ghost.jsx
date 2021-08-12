import React, { useEffect, useRef, useState } from "react";

const Ghost = () => {
  const ghost = useRef();
  const [pos, setPos] = useState(false);
  const [orient, setOrient] = useState({ x: true, y: true });
  const update = (e) => {
    const { clientX, clientY } = e;
    requestAnimationFrame(() => setPos({ clientX, clientY }));
  };
  useEffect(() => {
    setOrient({
      x: pos.clientX < window.innerWidth / 2,
      y: pos.clientY < window.innerHeight / 2,
    });
  }, [pos]);
  useEffect(() => {
    addEventListener("mousemove", update, { passive: true });
    return () => removeEventListener("mousemove", update);
  }, []);
  return (
    <div
      style={{
        opacity: pos ? 1 : 0,
        transition: "opacity 1s",
        top: "-25vmin",
        left: "-25vmin",
        pointerEvents: "none",
        width: "50vmin",
        height: "50vmin",
        position: "fixed",
        transform: `translate(${pos.clientX}px, ${pos.clientY}px)`,
      }}
    >
      <div
        style={{
          transition: "transform 0.5s ",
          transform: `rotateY(${orient.x ? "0deg" : "180deg"})`,
        }}
      >
        <img
          id="ghost"
          alt="ghost"
          ref={ghost}
          style={{ width: "50vmin", height: "50vmin" }}
          src="/ultra.svg"
        />
      </div>
    </div>
  );
};

export default Ghost;
