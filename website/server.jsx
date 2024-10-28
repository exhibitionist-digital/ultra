// @ts-check

import { Hono } from "hono";
import Layout from "./layouts/Layout.jsx";

const app = new Hono();

/**
 * Handles GET requests for the root route "/"
 * @param {import("hono").Context} c - The Hono context object
 * @returns {Response} The HTML response using the Layout component
 */
app.get("/", (c) => {
  return c.html(<Layout></Layout>);
});

export default app;
