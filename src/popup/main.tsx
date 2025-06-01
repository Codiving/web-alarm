import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";
import "./popup.css"; // 기존 스타일이 있다면 여기서 import

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
