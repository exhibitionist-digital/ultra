import { Form, useLoaderData } from "react-router-dom";
import type { Note } from "../../server.tsx";

export function Note() {
  const data = useLoaderData() as Note;
  return (
    <>
      <h2>{data.title}</h2>
      <div>{data.content}</div>
      <Form method="post">
        <input type="hidden" name="id" value={data.id} />
        <button type="submit">Delete</button>
      </Form>
    </>
  );
}
