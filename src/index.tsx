import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ProvideAuth } from "./hooks/useAuth";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById("root")
);
