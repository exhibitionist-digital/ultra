import React from "react";
import useSWR from "swr";

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
