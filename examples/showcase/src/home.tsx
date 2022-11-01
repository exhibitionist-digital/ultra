const Home = ({ inspected = "" }) => {
  return (
    <>
      <title>Ultra: Experimental</title>
      <p>
        Welcome to{" "}
        <strong>Ultra</strong>. The little web-framework which has no bundler
        (it's very fast not having to bundle) and ships the same ESM that you
        write (you can do that now in 2022).
      </p>
      <p>
        It gives the big-boy frameworks a run for their VC money. (j/k we would
        really like some too, hit us up on Discord)
      </p>
      <hr />
      <p>
        This is the homepage. It is static HTML, it ships Zero-JS™.
      </p>
      <p>
        Can you please do us a favour and open your network tab and refresh this
        page?
      </p>
      {!inspected && (
        <p>
          OPEN NETWORK TAB AND{" "}
          <a href="/?inspector=yes">
            CLICK THIS TO REFRESH THE PAGE
          </a>
        </p>
      )}
      {inspected && (
        <>
          <p>
            Thanks for the refresh. Look at how little there is in the Network
            tab, crazy huh?
          </p>
          <p>
            Now let's look at __hydration__ 😰
          </p>
          <p>
            <a href="/hydration">GO FORTH 2 HYDRATE</a>
          </p>
        </>
      )}
    </>
  );
};

export default Home;
