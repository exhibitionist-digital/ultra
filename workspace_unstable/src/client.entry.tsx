import { hydrateRoot } from "react-dom/client";
import React from "react";
import App from "./app.tsx";

hydrateRoot(document, <App requestContext={self.__ultra_request_context} />);
