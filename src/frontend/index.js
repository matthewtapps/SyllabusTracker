import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/reset.css"

import Website from "./Website";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Website />
  </StrictMode>
);
