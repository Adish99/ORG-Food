import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { WebLayout } from "./components/layout/WebLayout";

import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { Logout } from "./pages/Logout";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { OrderDetails } from "./pages/OrderDetail";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AddProduct } from "./pages/admin/AddProduct";
import { EditProduct } from "./pages/admin/EditProduct";
import { AddCategory } from "./pages/admin/AddCategory";
import { EditCategory } from "./pages/admin/EditCategory";
import { AdminOrderDetails } from "./pages/admin/AdminOrderDetails";


const App=()=>{
const router = createBrowserRouter([
  // ==========================
  // Website Routes
  // ==========================
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "products",
        element: <Products />
      },
      {
        path: "product/:id",
        element: <ProductDetail />
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        )
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        )
      },
      {
        path: "logout",
        element: <Logout />
      }
    ]
  },

  // ==========================
  // Admin Routes
  // ==========================
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "products",
        element: <AdminProducts />
      },
      {
  path: "products/add",
  element: <AddProduct />
},
{
  path: "products/edit/:id",
  element: <EditProduct />
},
     {
        path: "categories",
        element: <AdminCategories />
      },
      {
    path: "categories/add",
    element: <AddCategory />
},
{
    path: "categories/edit/:id",
    element: <EditCategory />
},
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
    path: "orders/:id",
    element: <AdminOrderDetails />
},
      {
        path: "users",
        element: <AdminUsers />
      }
    ]
  }
]);

return (
  <RouterProvider router={router}>

  </RouterProvider>
)
}

export default App;