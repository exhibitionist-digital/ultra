import { Helmet } from "react-helmet";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "three";

const Ultra = () => {
  const [mount, set] = useState(false);
  useEffect(() => {
    set(true);
  }, []);
  return (
    <div>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Ultra: React Three Fiber</title>
        <link rel="stylesheet" href="/style.css?threejs" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://ultrajs.dev/logo.svg"
        />
      </Helmet>
      <main>
        {!mount && <span>LOADING</span>}
        {mount && (
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
          </Canvas>
        )}
      </main>
    </div>
  );
};

function Box(props) {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default Ultra;
