import { Link, useLoaderData } from "react-router-dom";

export function Home() {
  const data = useLoaderData() as {
    id: number;
    title: string;
    content: string;
  }[];
  return (
    <div>
      Notes:
      <ul>
        {data.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
