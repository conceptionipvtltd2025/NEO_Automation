import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Query } from "./components/providers/Query";
import { SmoothScroll } from "./components/providers/SmoothScroll";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Query>
      <BrowserRouter>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </BrowserRouter>
    </Query>
  </React.StrictMode>
);
