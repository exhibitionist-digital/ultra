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
     {/* <Ghost />*/}
      <img className="logo" src="https://dweb.link/ipfs/bafkreiah6lyqltjzmqaggn3iang6sip7tnbotvxyqeg6zgrem6wqniegfm" height="350" />
      <h1>Ultra</h1>
      <h2>Deno + React: No build, No bundle, All streaming</h2>
      <a className="gh" target="_blank">View on GitHub</a>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <Graveyard />
    </main>
  );
};

export default Index;
