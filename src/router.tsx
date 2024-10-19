import App from "./App.tsx";
import { createBrowserRouter } from "react-router-dom";
import AssetForm from "./components/AssetForm.tsx";
import AffordForm from "./AffordForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/asset/:id",
        element: <AssetForm />,
      },
      {
        path: "/afford/:multiplier",
        element: <AffordForm />,
      },
    ],
  },
]);

export default router;
