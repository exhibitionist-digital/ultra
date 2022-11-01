import { use } from "react";

const fetchPost = fetch("https://pokeapi.co/api/v2/pokemon/froslass").then((
  r,
) => r.json());

const Data = () => {
  const data = use(fetchPost);
  return (
    <>
      <title>Ultra: Data-fetching</title>
      <h3>Pokemon fetching:</h3>
      <h2>{data.name}</h2>
      <p>
        {Object.keys(data?.sprites || {}).filter((i) =>
          typeof data?.sprites[i] === "string"
        ).map((
          i,
        ) => <img key={i} src={data.sprites[i]} />)}
      </p>
      <p>
        <strong>Abilities:</strong>
        {data?.abilities?.map((a) => (
          <span key={a?.ability?.name}>{" "}{a?.ability?.name}</span>
        ))}
      </p>
      <hr />
      <p>
        Here we are using React's new <code>use</code>{" "}
        API. Async data-fetching in your components, without the need for an
        additional library!
      </p>
      <p>
        Read more here...{" "}
        <a href="https://github.com/reactjs/rfcs/pull/229" target="_blank">
          https://github.com/reactjs/rfcs/pull/229
        </a>
      </p>
      <hr />
      <p>
        <a href="/head">What about the HEAD tags!?</a>
      </p>
    </>
  );
};

export default Data;
