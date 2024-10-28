// @ts-check

import { Hono } from "hono";
import Layout from "./layouts/Layout.jsx";

const app = new Hono();

app.get("/", (/** @type {import("hono").Context} */ c) => {
  return c.html(<Layout />);
});

export default app;
