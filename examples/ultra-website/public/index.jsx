import React from "react";
import Graveyard from "./components/graveyard.jsx";
import Ghost from "./components/ghost.jsx";
import useSWR from "swr";

export const fetcher = async (url) => {
  let content = await fetch(`ULTRA_URL${url}`);
  content = await content.json();
  return content;
};

const Index = () => {
  const { data, error } = useSWR("/markdown", fetcher, { suspense: true });
  const { content } = data;
  return (
    <main>
      <Ghost />
      <h1>Ultra</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <Graveyard />
    </main>
  );
};

export default Index;
