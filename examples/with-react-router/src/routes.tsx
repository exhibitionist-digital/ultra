import { Home } from "./pages/home.tsx";
import { Create } from "./pages/create.tsx";
import { Note } from "./pages/note.tsx";
import { GlobalLayout } from "./layouts/global.tsx";
import type { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    element: <GlobalLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: async () => {
          const res = await fetch("http://localhost:8000/notes/all");
          return res.json();
        },
      },
      {
        path: "/create",
        element: <Create />,
        action: async ({ request }) => {
          const data = await request.formData();
          const response = await fetch("/notes/create", {
            method: "POST",
            body: data,
          });
          const { id } = await response.json();
          return new Response(null, {
            status: 303,
            headers: {
              Location: "/notes/" + id,
            },
          });
        },
      },
      {
        path: "/notes/:id",
        element: <Note />,
        loader: async ({ params }) => {
          const res = await fetch(
            `http://localhost:8000/notes/get/${params.id}`,
          );
          return res.json();
        },
        action: async ({ request }) => {
          const data = await request.formData();
          const response = await fetch("/notes/delete", {
            method: "POST",
            body: data,
          });
          return new Response(null, {
            status: 303,
            headers: {
              Location: "/",
            },
          });
        },
      },
    ],
  },
];
