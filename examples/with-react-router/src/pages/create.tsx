import { Form } from "react-router-dom";

export function Create() {
  return (
    <div>
      <h3>New Note</h3>
      <Form method="post">
        <input name="title"></input>
        <textarea name="content"></textarea>
        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
