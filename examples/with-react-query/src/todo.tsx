import { useQuery } from "@tanstack/react-query";

type TodoProps = {
  id: number;
};

export default function Todo({ id }: TodoProps) {
  const query = useQuery(["todo", { id }], async () => {
    return await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    ).then((response) => response.json());
  });

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
}
