import React from "react";

const Graveyard = () => {
  const gravestones = [
    ".cjs",
    "require()",
    "node_modules",
    "package.json",
    "webpack.config",
    "babel.config",
    "create-react-app",
    "next.js",
  ];
  return (
    <ul className="graveyard">
      {gravestones.map((grave) => {
        return (
          <li>
            <figure>
              <img src="/grave.svg" alt="Gravestone" />
              <figcaption>{grave}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
};

export default Graveyard;
