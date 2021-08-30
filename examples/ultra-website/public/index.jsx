import React from "react";
import Graveyard from "./components/graveyard.jsx";
import Ghost from "./components/ghost.jsx";

const Index = () => {
  return (
    <main>
      <Ghost />
      <img
        className="logo"
        src="/logo.svg"
        height="350"
      />
      <h1>Ultra</h1>
      <h2>Deno + React: No build, No bundle, All streaming</h2>
      <a className="gh" target="_blank" href="https://github.com/exhibitionist-digital/ultra">View on GitHub</a>
      <Graveyard />
    </main>
  );
};

export default Index;
