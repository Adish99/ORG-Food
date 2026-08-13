import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ToastContainer} from "react-toastify";
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
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { NotFound } from "./pages/errors/NotFound";
import { Unauthorized } from "./pages/errors/UnAuthorized";
import { ErrorPage } from "./pages/errors/ErrorPage";
import { Contact } from "./pages/Contact";
import { AdminMessages } from "./pages/admin/AdminMessages";
import { VerifyOtp } from "./pages/verifyOtp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { VerifyResetOtp } from "./pages/VerifyResetOtp";
import { ResetPassword } from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { PaymentFailure } from "./pages/PaymentFailure";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { Wishlist } from "./pages/Wishlist";
import { Coupons } from "./pages/Coupons";


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
    path: "verify-otp",
    element: <VerifyOtp />
},
      {
        path: "login",
        element: <Login />
      },
      {
    path: "forgot-password",
    element: <ForgotPassword />
},
{
    path: "verify-reset-otp",
    element: <VerifyResetOtp />
},
{
    path: "reset-password",
    element: <ResetPassword />
},
      {
        path:"contact",
        element:<Contact/>
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
    path: "wishlist",
    element: (
        <ProtectedRoute>
            <Wishlist />
        </ProtectedRoute>
    )
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
    path: "coupons",
    element: (
        <ProtectedRoute>
            <Coupons />
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
  path: "payment/success",
  element: (
    <ProtectedRoute>
      <PaymentSuccess />
    </ProtectedRoute>
  )
},
{
  path: "payment/failure",
  element: (
    <ProtectedRoute>
      <PaymentFailure />
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
    path: "profile",
    element: (
        <ProtectedRoute>
            <Profile />
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
    element: (
      <AdminProtectedRoute>
<AdminLayout/>
      </AdminProtectedRoute>
  ),
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
    path: "messages",
    element: <AdminMessages />
},
{
    path: "profile",
    element: <AdminProfile />
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
    path: "reviews",
    element: <AdminReviews />
},
      {
        path: "users",
        element: <AdminUsers />
      }
    ]
  },
  {
    path:"/403",
    element:<Unauthorized/>
  },
  {
    path:"/error",
    element:<ErrorPage/>
  },
  {
    path:"*",
    element:<NotFound/>
  }
]);

return (
  <>
   <RouterProvider router={router}>
  </RouterProvider>
  <ToastContainer position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"></ToastContainer>
  </>
)
}

export default App;