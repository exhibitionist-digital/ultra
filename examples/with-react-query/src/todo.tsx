import { useQuery } from "@tanstack/react-query";
import useAsync from "ultra/hooks/use-async.js";

type TodoProps = {
  id: number;
};

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export default function Todo({ id }: TodoProps) {
  const query = useQuery(
    ["todo", { id }],
    useAsync<Todo>(() =>
      fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
      ).then((response) => response.json())
    ),
  );

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
}
