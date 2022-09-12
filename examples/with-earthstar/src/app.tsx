import { Peer, useAddShare, useCurrentShare, usePeer } from "react-earthstar";
import { FormatValidatorEs4, Replica, ReplicaDriverIndexedDB } from "earthstar";
import { useEffect } from "react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-earthstar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Peer
          onCreateShare={(address: string) => {
            // Here we're teaching Peer how to persist data for shares.
            const driver = new ReplicaDriverIndexedDB(address);
            return new Replica(address, FormatValidatorEs4, driver);
          }}
        >
          <h1>{"The beginnings of my app!"}</h1>
          <MyComponent />
        </Peer>
      </body>
    </html>
  );
}

const MyComponent = () => {
  const [currentShare, setCurrentShare] = useCurrentShare();
  const add = useAddShare();
  const peer = usePeer();
  useEffect(() => {
    add("+archery.k456");
    const allShares = peer.shares();
    setCurrentShare(allShares[0]);
  }, []);

  if (!currentShare) return <div>Not connected to any shares.</div>;
  return <div>{`You are currently browsing the docs of ${currentShare}!`}</div>;
};
