import { useQuery } from "@tanstack/react-query";

type TodoProps = {
  id: number;
};

export default function SlowTodo({ id }: TodoProps) {
  const query = useQuery(["todo", { id }], async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
    ).then((response) => response.json());
  }, {
    suspense: true,
  });

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
}
