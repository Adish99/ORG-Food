import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { UseAuth } from "../../store/Authentication";


export const Navbar=()=>{

const {isLoggedIn}=UseAuth();

return(

<nav className="navbar">


<div className="logo">

<NavLink to="/">
🌱 Org-Khana
</NavLink>

</div>



<ul className="nav-links">


<li>

<NavLink to="/">

Home

</NavLink>

</li>



<li>

<NavLink to="/products">

Products

</NavLink>

</li>


{
    isLoggedIn && 
<li>

<NavLink to="/cart">

Cart 🛒

</NavLink>

</li>
}

{
    isLoggedIn &&
<li>

<NavLink to="/orders">

Orders

</NavLink>

</li>
}

{
    isLoggedIn &&
<li>

<NavLink to="/checkout">

Checkout

</NavLink>

</li>
}

{
    !isLoggedIn?(
        <>
       <li>

<NavLink to="/login">

Login

</NavLink>

</li>

<li>

<NavLink to="/register">

Register

</NavLink>

</li> 
</>
    ):(
<li>

<NavLink to="/logout">

Logout

</NavLink>

</li>
    )
}

</ul>



</nav>

)

}