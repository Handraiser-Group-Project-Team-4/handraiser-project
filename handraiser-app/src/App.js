import React from "react";
import { HashRouter } from "react-router-dom";
import Routes from "./routes";
import 'status-indicator/styles.css'

export default function App() {
  return (
    <HashRouter>
      <Routes />
    </HashRouter>
  );
}
