import { useTw } from "./hooks/useTw.ts";

const Tailwind = () => {
  const tw = useTw();
  return (
    <>
      <title>Ultra: Tailwind</title>
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
        <a href="/data">Let's try fetching some DATA</a>
      </p>
    </>
  );
};

export default Tailwind;
