import React from "react";
import { HashRouter } from "react-router-dom";
import Routes from "./routes";
import { SnackbarProvider } from "notistack";
import "status-indicator/styles.css";
export default function App() {
  return (
    <SnackbarProvider maxSnack={5} hideIconVariant={false}>
      <HashRouter>
        <Routes />
      </HashRouter>
    </SnackbarProvider>
  );
}
