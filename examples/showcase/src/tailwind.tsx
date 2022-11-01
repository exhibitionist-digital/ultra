import { useTw } from "./hooks/useTw.ts";

const Tailwind = () => {
  const tw = useTw();
  return (
    <>
      <div className={tw(`text(3xl white) bg-blue-500 p-3`)}>
        Some people...
      </div>
      <div className={tw(`text(3xl white) bg-red-500 p-3`)}>
        like this tailwind thing...
      </div>
      <div className={tw(`text(3xl white) bg-green-500 p-3`)}>
        I dunno... what do you think?
      </div>
      <hr />
      <p>
        In conclusion: Yes, we can have nice things without having to resort to
        crazy abstractions and black-box bundling approaches. Check out examples
        for using <strong>Ultra</strong> with <em>react-query</em>,{" "}
        <em>react-router</em>, <em>wouter</em>, <em>mdx</em>,{" "}
        <em>preact</em>, and more{" "}
        <a
          href="https://github.com/exhibitionist-digital/ultra/tree/main/examples"
          target="_blank"
        >
          here!
        </a>
      </p>
      <p>
        <strong>
          Next-gen performance, scalability, maintainability, and browser
          optimisation is here! Thank you Elon!!
        </strong>
      </p>
    </>
  );
};

export default Tailwind;
