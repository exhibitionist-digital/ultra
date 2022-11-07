import React from "react";
import { getStarCount } from "../api/github.ts";

const href = "https://github.com/exhibitionist-digital/ultra";
const starCount = getStarCount();

export default function GitHub() {
  //@ts-ignore whatever
  const stars = React.use(starCount);
  return (
    <a id="github" href={href} target="_blank">
      ★ <span>{stars?.stargazers_count}</span>
    </a>
  );
}
