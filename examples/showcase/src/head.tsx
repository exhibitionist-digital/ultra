const Head = () => {
  return (
    <>
      <title>Ultra: Head</title>
      <p>
        Head tags are managed via the new React Resources API. Title, Links,
        Meta, you name it...
      </p>
      <p>
        Managing head tags in React has been a total headf*** to this point.
        Very much needed.
      </p>
      <p>
        Read more about React Resource API here...{" "}
        <a href="https://github.com/reactjs/rfcs/pull/219" target="_blank">
          https://github.com/reactjs/rfcs/pull/219
        </a>
      </p>
      <hr />
      <p>
        <strong>
          All of the HEAD tags you see on this site are managed with this new
          API.
        </strong>
      </p>
      <hr />
      <p>
        <a href="/conclusion">In Conclusion</a>
      </p>
    </>
  );
};

export default Head;
