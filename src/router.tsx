import App from "./App.tsx";
import { createBrowserRouter } from "react-router-dom";
import AssetForm from "./components/AssetForm.tsx";
import AffordForm from "./AffordForm.tsx";
import NetForm from "./components/NetForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/asset/:slug",
        element: <AssetForm />,
      },
      {
        path: "net",
        element: <NetForm />,
      },
      {
        path: "/afford/:multiplier",
        element: <AffordForm />,
      },
    ],
  },
]);

export default router;
