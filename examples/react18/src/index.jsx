import React, { lazy, Suspense } from "https://esm.sh/react@18.0.0-alpha-67f38366a-20210830";
import Spinner from "./components/spinner.jsx";

const Post = lazy(() => import("./components/post.jsx"));
const Sidebar = lazy(() => import("./components/sidebar.jsx"));
const Comments = lazy(() => import("./components/comments.jsx"));

const Index = () => {
  return (
    <main>
      <aside className="sidebar">
        <Suspense fallback={<Spinner />}>
          <Sidebar />
        </Suspense>
      </aside>
      <article className="post">
        <Suspense fallback={<Spinner />}>
          <Post />
        </Suspense>
        <section className="comments">
          <h2>Comments</h2>
          <Suspense fallback={<Spinner />}>
            <Comments date={+new Date()} />
          </Suspense>
        </section>
        <h2>Thanks for reading!</h2>
      </article>
    </main>
  );
};

export default Index;
