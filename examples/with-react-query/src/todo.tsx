import { useQuery } from "@tanstack/react-query";
import useAsync from "ultra/hooks/use-async.js";

type TodoProps = {
  id: number;
};

export default function Todo({ id }: TodoProps) {
  const promise = useAsync(
    fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    ).then((response) => response.json()),
  );

  const query = useQuery(
    ["todo", { id }],
    () => promise,
  );

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
}
