import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { UseAuth } from "../../store/Authentication";

export const Navbar = () => {

    const {
        isLoggedIn,
        user,
        loading
    } = UseAuth();

    console.log({
        isLoggedIn,
        user,
        loading
    });
    if (loading) {
        return null;
    }

    return (

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
                    <NavLink to="/about">
        Learn More
</NavLink>
                </li>


                <li>
                    <NavLink to="/products">
                        Products
                    </NavLink>
                </li>
              {
    isLoggedIn && (
        <li>
            <NavLink to="/wishlist">
                ❤️ Wishlist
            </NavLink>
        </li>
    )
}
                


                {/* Admin */}

                {
                    isLoggedIn &&
                    user?.role === "admin" && (

                        <li>

                            <NavLink to="/admin/dashboard">
                                Admin
                            </NavLink>

                        </li>

                    )
                }


                {/* Cart */}

                {
                    isLoggedIn && (

                        <li>

                            <NavLink to="/cart">
                                Cart 🛒
                            </NavLink>

                        </li>

                    )
                }


                {/* Orders */}

                {
                    isLoggedIn && (

                        <li>

                            <NavLink to="/orders">
                                Orders
                            </NavLink>

                        </li>

                    )
                }

                {
    isLoggedIn && (
        <li>
            <NavLink to="/coupons">
                🎟️ Coupons
            </NavLink>
        </li>
    )
}


                {/* Checkout */}

                {
                    isLoggedIn && (

                        <li>

                            <NavLink to="/checkout">
                                Checkout
                            </NavLink>

                        </li>

                    )
                }


                {/* Login / Register / Logout */}

                {
                    !isLoggedIn ? (

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

                    ) : (

                        <li>

                            <NavLink to="/logout">
                                Logout
                            </NavLink>

                        </li>

                    )
                }


                {/* My Account + Profile Picture */}

                {
                    isLoggedIn && (

                        <li>

                            <NavLink
                                to="/profile"
                                className="account-link"
                            >

                                <div className="navbar-profile-picture">

                                    {
                                        user?.profileImage ? (

                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                            />

                                        ) : (

                                            <div className="navbar-default-avatar">

                                                {
                                                    user?.username
                                                        ?.charAt(0)
                                                        .toUpperCase() || "A"
                                                }

                                            </div>

                                        )

                                    }

                                </div>

                                <span>
                                    My Account
                                </span>

                            </NavLink>

                        </li>

                    )
                }

            </ul>

        </nav>

    );

};