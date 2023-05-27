import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import { useCookies } from "react-cookie";
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
import Invoice from "./components/Invoice";
import Orders from "./pages/orders/Orders";
import Login from "./pages/login/Login";
import Incomes from "./pages/incomes/Incomes";
import AddOrders from "./pages/orders/AddOrders";
import UpdateOrders from "./pages/orders/UpdateOreder";
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
        path: "invoice",
        element: <Invoice />,
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
      }
    ],
  }
]);
// export default function App() {
//   const [cookies,setCookies] = useCookies("access_token");
//   const user = window.localStorage.getItem("token")
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route>
//           { !user ? <Route index element={<Login />} />:
//           <><Route path="exponses" element={<Exponses />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="income" element={<Income />} />
//           <Route path="invoice" element={<Invoice />} />
//           <Route path="home" element={<Home />} /> </>}
//           {/* <Route path="/" element={<AppLayout />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
  // <App />
);