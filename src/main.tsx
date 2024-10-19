import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./index.css";
import theme from "./theme.ts";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
