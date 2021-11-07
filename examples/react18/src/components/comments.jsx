import React from "https://esm.sh/react@18.0.0-alpha-67f38366a-20210830";
import useSWR from "https://esm.sh/swr@1.0.0?deps=react@18.0.0-alpha-67f38366a-20210830&bundle";

export const fetcher = async () => {
  const comments = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        "Wait, it doesn't wait for React to load?",
        "How does this even work?",
        "I like marshmallows",
      ]);
    }, 5000);
  });
  return { comments };
};

export default function Comments({ date }) {
  const { data, error } = useSWR(date, fetcher, { suspense: true });
  const { comments } = data;
  return (
    <>
      {comments.map((comment, i) => (
        <p className="comment" key={i}>
          {comment}
        </p>
      ))}
    </>
  );
}
