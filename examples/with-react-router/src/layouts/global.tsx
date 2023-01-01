import { Link, Outlet } from "react-router-dom";

export function GlobalLayout() {
  return (
    <>
      <nav>
        <Link to="/">Notes</Link>
        <span>{"   "}</span>
        <Link to="/create">New Note</Link>
      </nav>
      <Outlet />
    </>
  );
}
