import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

hydrate(document, <App />);

let socket: WebSocket;

const socketMessageListener = (event: MessageEvent) => {
  if (event.data === "reload") {
    socket.removeEventListener("message", socketMessageListener);
    socket.addEventListener("message", (event) => {
      if (event.data === "reload") {
        window.location.reload();
      }
    });
    socket.send("reload");
  }

  if (event.data === "pong") {
    setTimeout(() => socket.send("ping"), 2000);
  }
};

// Open
const socketOpenListener = (event: Event) => {
  console.log("Connected");
  socket.send("ping");
};

// Closed
const devListener = () => {
  if (socket) {
    console.error("Disconnected.");
  }
  socket = new WebSocket("ws://localhost:8080");
  socket.addEventListener("open", socketOpenListener);
  socket.addEventListener("message", socketMessageListener);
  socket.addEventListener("close", devListener);
};

devListener();
