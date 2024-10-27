import App from "./App.tsx";
import { createBrowserRouter } from "react-router-dom";
import AssetForm from "./components/AssetForm.tsx";
import AffordForm from "./AffordForm.tsx";
import NetForm from "./components/NetForm.tsx";
import ExamplesPage from "./ExamplesPage.tsx";

const router = createBrowserRouter([
  {
    path: "/examples",
    element: <ExamplesPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/asset/:slug/edit",
        element: <AssetForm />,
      },
      {
        path: "/asset/add/house",
        element: <AssetForm addNew="house" />,
      },
      {
        path: "/asset/add/misc",
        element: <AssetForm addNew="misc" />,
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
