import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import "./App.css";
import Exponses from "./pages/exponses/Exponses";
import Orders from "./pages/orders/Orders";
import Login from "./pages/login/Login";
import Incomes from "./pages/incomes/Incomes";
import AddOrders from "./pages/orders/AddOrders";
import UpdateOrders from "./pages/orders/UpdateOreder";
import Invoice from "./components/invoices/Invoice";
import InsertArticle from "./pages/articles/InsertArticle";
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);
const user = window.localStorage.getItem("token")
const router = createBrowserRouter([
 !user ?{
  element: <Login />,
  children: [{
    path: "/",
    element: <Login />
  }]
}:{
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "incomes",
        element: <Incomes />,
      },
      {
        path: "exponses",
        element: <Exponses />,
      },
      {
        path: "addOrders",
        element: <AddOrders />,
      },
      {
        path: "updateOrders/:id",
        element: <UpdateOrders />,
      },
      {
        path: "invoice/:id",
        element: <Invoice />
      },
      {
        path: "insertArticle",
        element: <InsertArticle />
      }
    ],
  }
]);


createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);