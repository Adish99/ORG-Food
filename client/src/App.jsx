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


const App=()=>{

const router=createBrowserRouter([
{
path:"/",
element:<WebLayout/>,
children:[
{
index:true,
element:<Home/>
},
{
path:"register",
element:<Register/>
},
{
path:"login",
element:<Login/>
},
{
path:"products",
element:<Products/>
},
{
path:"product/:id",
element:<ProductDetail/>
},
{
path:"cart",
element:
(
<ProtectedRoute>
<Cart/>
</ProtectedRoute>
)
},
{
path:"checkout",
element:
(
<ProtectedRoute>
<Checkout/>
</ProtectedRoute>
)
},
{
path:"orders",
element:
(
<ProtectedRoute>
<Orders/>
</ProtectedRoute>
)
},
{
    path:"/logout",
    element:<Logout/>
}
]
}
])


return(
<RouterProvider router={router}/>
)
}

export default App;